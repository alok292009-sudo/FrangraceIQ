
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, ExternalLink, Star, Bookmark, BookmarkCheck, Loader2, Copy, ClipboardCheck } from 'lucide-react';
import ScentDNAAccordion from './ScentDNAAccordion';
import RatingSystem from './RatingSystem';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db, OperationType, handleFirestoreError, signInWithGoogle } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface Recommendation {
  name: string;
  brand: string;
  type: string;
  price: string;
  volume: string;
  availableOn: string[];
  productUrl?: string | null;
  similarityScore: number;
  whatMatches: string[];
  whatDoesNot: string[];
  longevity: string;
  projection: string;
  bestFor: string;
  season: string;
  verdict: string;
}

interface ResultCardProps {
  perfume: Recommendation;
  index: number;
  fragranceFamily: string;
  dominantAccords: string[];
  openingNotes: string[];
  drydownNotes: string[];
  keyDrivers: string;
  applicationTip: string;
  layeringTip: string | null;
  originalPerfume: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  perfume,
  index,
  fragranceFamily,
  dominantAccords,
  openingNotes,
  drydownNotes,
  keyDrivers,
  applicationTip,
  layeringTip,
  originalPerfume,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveDocId, setSaveDocId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        checkIfSaved(u.uid);
      } else {
        setIsSaved(false);
        setSaveDocId(null);
      }
    });
    return () => unsubscribe();
  }, [perfume.name, perfume.brand]);

  const checkIfSaved = async (uid: string) => {
    try {
      const q = query(
        collection(db, 'saved_dupes'),
        where('userId', '==', uid),
        where('name', '==', perfume.name),
        where('brand', '==', perfume.brand)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setIsSaved(true);
        setSaveDocId(querySnapshot.docs[0].id);
      }
    } catch (error) {
      console.error("Error checking if saved:", error);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) {
      try {
        await signInWithGoogle();
        return;
      } catch (error) {
        return;
      }
    }

    setIsSaving(true);
    try {
      if (isSaved && saveDocId) {
        await deleteDoc(doc(db, 'saved_dupes', saveDocId));
        setIsSaved(false);
        setSaveDocId(null);
      } else {
        const docRef = await addDoc(collection(db, 'saved_dupes'), {
          name: perfume.name || 'Unknown',
          brand: perfume.brand || 'Unknown',
          originalPerfume: originalPerfume || 'Unknown',
          price: perfume.price || 'N/A',
          similarityScore: perfume.similarityScore || 0,
          userId: user.uid,
          createdAt: serverTimestamp()
        });
        setIsSaved(true);
        setSaveDocId(docRef.id);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'saved_dupes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'border-green-400 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.4)] bg-green-400/20';
    if (score >= 80) return 'border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)] bg-yellow-400/15';
    if (score >= 70) return 'border-blue-400 text-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.2)] bg-blue-400/10';
    return 'border-white/20 text-white/60 bg-white/5';
  };

  const scoreClass = getScoreColor(perfume.similarityScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="liquid-glass rounded-2xl p-5 md:p-8 flex flex-col w-full relative overflow-hidden"
    >
      {/* Background Scent Accents */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[100px] opacity-10 ${perfume.similarityScore >= 90 ? 'bg-green-400' : 'bg-white'}`} />

      {/* Top Row */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
        <div className="flex flex-col">
          <h3 className="font-heading italic text-3xl md:text-5xl text-white leading-tight drop-shadow-md">
            {perfume.name}
          </h3>
          <span className="text-white text-base md:text-lg font-body font-black mt-1 drop-shadow-sm">by {perfume.brand}</span>
          <div className="inline-block mt-4">
            <span className="liquid-glass rounded-lg px-4 py-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-white bg-white/30 border-2 border-white/40 shadow-lg">
              {perfume.type}
            </span>
          </div>
        </div>

          <div className="flex flex-row md:flex-col items-center gap-4 self-center md:self-auto">
            {/* Save Button */}
            <button
              onClick={handleSaveToggle}
              disabled={isSaving}
              className={`p-3 rounded-full border transition-all duration-300 ${
                isSaved 
                  ? 'bg-yellow-400 border-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.4)]' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/40'
              }`}
            >
              {isSaving ? (
                <Loader2 size={20} className="animate-spin" />
              ) : isSaved ? (
                <BookmarkCheck size={20} />
              ) : (
                <Bookmark size={20} />
              )}
            </button>

            <div className={`w-[90px] h-[90px] md:w-[110px] md:h-[110px] rounded-full border-[3px] flex flex-col items-center justify-center shadow-2xl backdrop-blur-md transition-all duration-700 ${scoreClass}`}>
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 + 0.5, type: 'spring' }}
              className="font-heading italic text-3xl md:text-4xl leading-none font-bold"
            >
              {Math.round(perfume.similarityScore)}%
            </motion.span>
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-tight opacity-80">match</span>
            
            {/* Inner Ring Glow */}
            <div className={`absolute inset-0 rounded-full border-2 border-white/10 ${perfume.similarityScore >= 90 ? 'animate-pulse' : ''}`} />
          </div>
        </div>
      </div>

      {/* Price & Volume */}
      <div className="mt-8 flex items-baseline gap-3">
        <span className="text-yellow-400 font-heading italic text-3xl md:text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] filter brightness-125">{perfume.price}</span>
        <span className="text-white/70 font-black uppercase text-sm md:text-base tracking-widest drop-shadow-sm">{perfume.volume}</span>
      </div>

      {/* Scent DNA Accordion */}
      <ScentDNAAccordion 
        fragranceFamily={fragranceFamily}
        dominantAccords={dominantAccords}
        openingNotes={openingNotes}
        drydownNotes={drydownNotes}
        keyDrivers={keyDrivers}
      />

      {/* Match Breakdown */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <h4 className="text-white text-[12px] font-black uppercase tracking-[0.3em] mb-4 opacity-100 flex items-center gap-2 drop-shadow-sm">
            <span className="h-[2px] w-6 bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
            WHAT MATCHES
          </h4>
          <ul className="flex flex-col gap-3">
            {perfume.whatMatches.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
                <CheckCircle size={18} className="text-green-400 shrink-0 mt-0.5 filter drop-shadow-[0_0_5px_rgba(74,222,128,0.3)]" />
                <span className="text-white text-sm md:text-base font-body font-black leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white text-[12px] font-black uppercase tracking-[0.3em] mb-4 opacity-100 flex items-center gap-2 drop-shadow-sm">
            <span className="h-[2px] w-6 bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"></span>
            WHAT DOESN'T
          </h4>
          <ul className="flex flex-col gap-3">
            {perfume.whatDoesNot.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-white/10 p-4 rounded-xl border border-white/10 shadow-lg backdrop-blur-sm">
                <XCircle size={18} className="text-red-400 shrink-0 mt-0.5 filter drop-shadow-[0_0_5px_rgba(248,113,113,0.3)]" />
                <span className="text-white text-sm md:text-base font-body font-black leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Performance Badges */}
      <div className="mt-10 flex flex-wrap gap-3">
        {[
          { label: 'Longevity', value: perfume.longevity, icon: '⏱' },
          { label: 'Projection', value: perfume.projection, icon: '📡' },
          { label: 'Best For', value: perfume.bestFor, icon: '✦' },
          { label: 'Season', value: perfume.season, icon: '🌤' }
        ].map((badge, idx) => (
          <div key={idx} className="liquid-glass rounded-xl px-5 py-3 text-[12px] md:text-sm text-white font-black bg-white/20 border-2 border-white/10 shadow-xl backdrop-blur-xl hover:scale-105 transition-transform duration-300">
             <span className="mr-2 text-base">{badge.icon}</span>
             <span className="tracking-tight">{badge.value}</span>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="mt-8 p-8 rounded-2xl bg-white/20 border-2 border-white/20 shadow-2xl backdrop-blur-2xl">
        <p className="text-white text-base md:text-lg font-body font-black italic leading-relaxed text-center drop-shadow-md">
          "{perfume.verdict}"
        </p>
      </div>

      {/* Accuracy Rating */}
      <RatingSystem 
        targetPerfume={perfume.name}
        targetBrand={perfume.brand}
        originalPerfume={originalPerfume}
      />

      {/* Buy Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
        {/* Priority Direct Link */}
        {perfume.productUrl && perfume.productUrl.startsWith('http') && (
          <div className="flex items-stretch gap-0.5 w-full sm:w-auto">
            <a 
              href={perfume.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-l-lg px-6 md:px-8 py-3.5 md:py-4 text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer z-20 relative shadow-2xl border-2 border-r-0 bg-yellow-400 text-black border-yellow-500/50 shadow-yellow-400/20 hover:bg-yellow-300 active:scale-[0.98] flex-1 sm:flex-none sm:min-w-[180px]"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-black uppercase tracking-tight">Direct Purchase</span>
              <ExternalLink size={14} strokeWidth={3} />
            </a>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyUrl(perfume.productUrl!);
              }}
              className={`rounded-r-lg px-4 py-3.5 md:py-4 transition-all flex items-center justify-center z-20 relative shadow-2xl border-2 border-l-0 ${
                copied 
                  ? 'bg-green-500 text-white border-green-600' 
                  : 'bg-yellow-400 text-black border-yellow-500/50'
              } hover:brightness-110 active:scale-[0.98] group`}
              title="Copy link"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <ClipboardCheck size={16} strokeWidth={3} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Copied!</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Copy size={16} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}

        {/* Platform Buttons */}
        {perfume.availableOn.filter(p => p.trim() !== "").map((platform) => {
          const cleanPlatform = platform.trim();
          const lowerPlatform = cleanPlatform.toLowerCase();
          
          if (lowerPlatform.includes('website') && perfume.productUrl) return null;

          const baseSearch = `${perfume.brand} ${perfume.name}`;
          const marketplaceSearch = encodeURIComponent(`${baseSearch} ${perfume.volume || ''} perfume`);
          const googleSearch = encodeURIComponent(`${baseSearch} perfume buy online India original`);

          let url = `https://www.google.com/search?q=${googleSearch}`;
          
          if (lowerPlatform.includes('amazon')) {
            url = `https://www.amazon.in/s?k=${marketplaceSearch}`;
          } else if (lowerPlatform.includes('flipkart')) {
            url = `https://www.flipkart.com/search?q=${marketplaceSearch}`;
          } else if (lowerPlatform.includes('meesho')) {
            url = `https://www.meesho.com/search?q=${marketplaceSearch}`;
          }

          return (
            <a 
              key={platform} 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-6 md:px-8 py-3.5 md:py-4 text-xs md:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer z-20 relative shadow-2xl border-2 bg-white text-black border-white/30 hover:scale-105 active:scale-95 w-full sm:w-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-black uppercase tracking-tight">
                {`Search on ${cleanPlatform}`}
              </span>
              <ExternalLink size={14} strokeWidth={3} />
            </a>
          );
        })}
      </div>

      {/* Review Links */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        <a 
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${perfume.name} ${perfume.brand} perfume review India`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white font-black hover:text-white/80 transition-colors flex items-center gap-2 bg-red-600/20 px-3 py-1.5 rounded-full border border-red-500/20"
        >
          <span>Watch Reviews on YouTube</span>
          <ExternalLink size={12} />
        </a>
        <a 
          href={`https://www.google.com/search?q=${encodeURIComponent(`site:reddit.com ${perfume.name} ${perfume.brand} perfume review`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white font-black hover:text-white/80 transition-colors flex items-center gap-2 bg-orange-600/20 px-3 py-1.5 rounded-full border border-orange-500/20"
        >
          <span>Reddit Discussions</span>
          <ExternalLink size={12} />
        </a>
        <a 
          href={`https://www.instagram.com/explore/tags/${perfume.name.replace(/\s+/g, '').toLowerCase()}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white font-black hover:text-white/80 transition-colors flex items-center gap-2 bg-pink-600/20 px-3 py-1.5 rounded-full border border-pink-500/20"
        >
          <span>Instagram Feed</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Tips */}
      <div className="mt-10 pt-8 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <span className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.3em] block mb-3 px-1 drop-shadow-md">Apply here</span>
          <div className="bg-white/20 rounded-xl p-5 border-2 border-white/30 shadow-2xl backdrop-blur-2xl">
            <span className="text-white text-[14px] md:text-base font-black leading-relaxed drop-shadow-md">{applicationTip}</span>
          </div>
        </div>
        {layeringTip && (
          <div>
            <span className="text-white text-[12px] md:text-[14px] font-black uppercase tracking-[0.3em] block mb-3 px-1 drop-shadow-md">Layer with</span>
            <div className="bg-white/20 rounded-xl p-5 border-2 border-white/30 shadow-2xl backdrop-blur-2xl">
              <span className="text-white text-[14px] md:text-base font-black leading-relaxed drop-shadow-md">{layeringTip}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ResultCard;
