import React, { useState, useEffect } from 'react';
import { auth, db, OperationType, handleFirestoreError } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy, limit, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { History, Star, User as UserIcon, LogOut, Clock, ChevronRight, Bookmark, ArrowUpDown } from 'lucide-react';

interface PastSearch {
  id: string;
  query: string;
  budget: string;
  createdAt: any;
}

interface PastRating {
  id: string;
  targetPerfume: string;
  targetBrand: string;
  originalPerfume: string;
  rating: number;
  createdAt: any;
}

interface SavedDupe {
  id: string;
  name: string;
  brand: string;
  originalPerfume: string;
  price: string;
  similarityScore: number;
  createdAt: any;
}

interface ProfileProps {
  onClose: () => void;
  onSearchAgain: (query: string, budget: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onClose, onSearchAgain }) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [searches, setSearches] = useState<PastSearch[]>([]);
  const [ratings, setRatings] = useState<PastRating[]>([]);
  const [savedItems, setSavedItems] = useState<SavedDupe[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'history' | 'ratings' | 'saved'>('history');
  const [savedSort, setSavedSort] = useState<'date' | 'name' | 'brand' | 'score'>('date');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        fetchUserData(u.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    setLoading(true);
    try {
      // Fetch searches
      const searchPath = 'searches';
      const searchSnap = await getDocs(query(
        collection(db, searchPath), 
        where('userId', '==', uid), 
        orderBy('createdAt', 'desc'), 
        limit(20)
      )).catch(err => {
        handleFirestoreError(err, OperationType.LIST, searchPath);
        return null;
      });
      if (searchSnap) {
        setSearches(searchSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PastSearch)));
      }

      // Fetch ratings
      const ratingPath = 'ratings';
      const ratingSnap = await getDocs(query(
        collection(db, ratingPath), 
        where('userId', '==', uid), 
        orderBy('createdAt', 'desc'), 
        limit(20)
      )).catch(err => {
        handleFirestoreError(err, OperationType.LIST, ratingPath);
        return null;
      });
      if (ratingSnap) {
        setRatings(ratingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PastRating)));
      }

      // Fetch saved dupes
      const savedPath = 'saved_dupes';
      const savedSnap = await getDocs(query(
        collection(db, savedPath),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc')
      )).catch(err => {
        handleFirestoreError(err, OperationType.LIST, savedPath);
        return null;
      });
      if (savedSnap) {
        setSavedItems(savedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedDupe)));
      }
    } catch (error) {
      console.error("Error fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    onClose();
  };

  const removeItem = async (id: string, collectionName: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === 'saved_dupes') {
        setSavedItems(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, collectionName);
    }
  };

  const formatDate = (ts: any) => {
    if (!ts) return '';
    const date = ts instanceof Timestamp ? ts.toDate() : new Date(ts);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getSortedSavedItems = () => {
    return [...savedItems].sort((a, b) => {
      if (savedSort === 'name') return a.name.localeCompare(b.name);
      if (savedSort === 'brand') return a.brand.localeCompare(b.brand);
      if (savedSort === 'score') return b.similarityScore - a.similarityScore;
      
      const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
      const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-black/90 border border-white/20 rounded-3xl backdrop-blur-3xl min-h-[400px]">
        <UserIcon size={48} className="text-white/20 mb-4" />
        <h2 className="text-2xl font-heading italic text-white mb-2">User Portal</h2>
        <p className="text-white/60 text-sm mb-6 max-w-xs">Sign in to sync your search history and dupe ratings across devices.</p>
        <button 
          onClick={onClose}
          className="px-8 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-xl"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-black/95 z-[100] border-l border-white/10 backdrop-blur-2xl shadow-[-20px_0_40px_rgba(0,0,0,0.5)] flex flex-col"
    >
      {/* Header */}
      <div className="p-8 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-12 h-12 rounded-full border border-white/20 shadow-lg" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <UserIcon className="text-white" />
            </div>
          )}
          <div>
            <h2 className="text-lg font-black text-white leading-tight">{user.displayName}</h2>
            <button 
              onClick={handleLogout}
              className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors flex items-center gap-1"
            >
              <LogOut size={10} /> Logout
            </button>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ChevronRight className="text-white" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 min-w-[100px] py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${
            activeTab === 'history' ? 'text-white border-b-2 border-white' : 'text-white/40'
          }`}
        >
          <History size={14} /> History
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          className={`flex-1 min-w-[100px] py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${
            activeTab === 'saved' ? 'text-white border-b-2 border-white' : 'text-white/40'
          }`}
        >
          <Bookmark size={14} /> Saved
        </button>
        <button 
          onClick={() => setActiveTab('ratings')}
          className={`flex-1 min-w-[100px] py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 ${
            activeTab === 'ratings' ? 'text-white border-b-2 border-white' : 'text-white/40'
          }`}
        >
          <Star size={14} /> Ratings
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-40 gap-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Syncing...</span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === 'history' ? (
              <motion.div 
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                {searches.length === 0 ? (
                  <div className="text-center py-20 opacity-40 italic text-sm text-white">No searches yet.</div>
                ) : (
                  searches.map((s) => (
                    <div
                      key={s.id}
                      className="liquid-glass p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1 flex items-center gap-1">
                          <Clock size={10} /> {formatDate(s.createdAt)}
                        </div>
                        <div className="text-white font-black text-sm group-hover:text-yellow-400 transition-colors uppercase tracking-wider">{s.query}</div>
                        <div className="text-white/60 text-[10px] font-bold">Max {s.budget}</div>
                      </div>
                      
                      <button
                        onClick={() => {
                          onSearchAgain(s.query, s.budget);
                          onClose();
                        }}
                        className="bg-white/5 hover:bg-yellow-400 hover:text-black text-yellow-400 p-2.5 rounded-lg border border-white/5 hover:border-yellow-400 transition-all flex items-center gap-2 group/btn shadow-xl"
                      >
                        <span className="text-[8px] font-black uppercase tracking-widest hidden group-hover:block whitespace-nowrap">Search Again</span>
                        <History size={14} className="group-hover/btn:rotate-[-20deg] transition-transform" />
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            ) : activeTab === 'saved' ? (
              <motion.div 
                key="saved"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                {savedItems.length > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
                      <ArrowUpDown size={12} /> Sort By
                    </div>
                    <div className="flex gap-2">
                      {(['date', 'name', 'brand', 'score'] as const).map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSavedSort(opt)}
                          className={`text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded border transition-all ${
                            savedSort === opt 
                              ? 'bg-white text-black border-white' 
                              : 'bg-transparent text-white/30 border-white/10 hover:border-white/30'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {savedItems.length === 0 ? (
                  <div className="text-center py-20 opacity-40 italic text-sm text-white">No saved dupes yet.</div>
                ) : (
                  getSortedSavedItems().map((item) => (
                    <div
                      key={item.id}
                      className="liquid-glass p-5 rounded-xl border border-white/5 relative group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-black text-base leading-tight">{item.name}</div>
                          <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{item.brand}</div>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id, 'saved_dupes')}
                          className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400"
                        >
                          <LogOut size={14} className="rotate-180" />
                        </button>
                        <div className="text-yellow-400 font-black text-xs">{item.similarityScore}% Match</div>
                      </div>
                      <div className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-2 pt-2 border-t border-white/5">
                        {item.price} • Clone of {item.originalPerfume}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="ratings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                {ratings.length === 0 ? (
                  <div className="text-center py-20 opacity-40 italic text-sm text-white">No ratings yet.</div>
                ) : (
                  ratings.map((r) => (
                    <div
                      key={r.id}
                      className="liquid-glass p-5 rounded-xl border border-white/5 relative overflow-hidden"
                    >
                      <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-2">{formatDate(r.createdAt)}</div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-white font-black text-base leading-tight">{r.targetPerfume}</div>
                          <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{r.targetBrand}</div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/10'} 
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-2 pt-2 border-t border-white/5">
                        Clone of: {r.originalPerfume}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Footer Meta */}
      <div className="p-8 border-t border-white/10 text-center">
        <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">© 2026 Fragrance Intelligence System</p>
      </div>
    </motion.div>
  );
};

export default Profile;
