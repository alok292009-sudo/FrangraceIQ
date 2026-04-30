import React, { useState, useEffect } from 'react';
import { Star, LogIn, Check } from 'lucide-react';
import { auth, db, signInWithGoogle, OperationType, handleFirestoreError } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

interface RatingSystemProps {
  targetPerfume: string;
  targetBrand: string;
  originalPerfume: string;
}

const RatingSystem: React.FC<RatingSystemProps> = ({ 
  targetPerfume, 
  targetBrand, 
  originalPerfume 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setIsSigningIn(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (selectedRating: number) => {
    if (!user) {
      setIsSigningIn(true);
      try {
        const loggedInUser = await signInWithGoogle();
        if (!loggedInUser) {
          setIsSigningIn(false);
          return;
        }
        // The useEffect will catch the user change and reset isSigningIn
      } catch (error) {
        console.error("Login failed", error);
        setIsSigningIn(false);
      }
      return;
    }

    setRating(selectedRating);
    setIsSubmitting(true);

    try {
      const path = 'ratings';
      await addDoc(collection(db, path), {
        targetPerfume,
        targetBrand,
        originalPerfume,
        rating: selectedRating,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      setHasRated(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'ratings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasRated) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-green-400 font-black text-xs uppercase tracking-widest mt-4 bg-green-400/10 px-4 py-2 rounded-lg border border-green-400/20"
      >
        <Check size={14} strokeWidth={4} />
        <span>Thanks for rating!</span>
      </motion.div>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <span className="text-white text-[12px] md:text-[13px] font-black uppercase tracking-[0.3em] drop-shadow-md">Rate Accuracy</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleSubmit(star)}
              disabled={isSubmitting || isSigningIn}
              className={`transition-all duration-200 transform ${isSigningIn || isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-125'} focus:outline-none`}
            >
              <Star
                size={20}
                className={`${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-white/20'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
      </div>

      {!user && (hoverRating > 0 || isSigningIn) && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-white/40 text-[9px] font-bold uppercase tracking-wider"
        >
          {isSigningIn ? (
            <div className="w-2.5 h-2.5 border border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn size={10} />
          )}
          <span>{isSigningIn ? 'Signing in...' : 'Login with Google to rate'}</span>
        </motion.div>
      )}
    </div>
  );
};

export default RatingSystem;
