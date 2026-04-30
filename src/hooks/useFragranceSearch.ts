
import { useState, useRef } from "react";
import { callGemini } from "../lib/geminiClient";
import { parseResponse } from "../lib/responseParser";
import { auth, db, OperationType, handleFirestoreError } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type SearchStatus = "idle" | "loading" | "success" | "error";

const searchHistoryCache: Record<string, any> = {};

export function useFragranceSearch() {
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [lastBudget, setLastBudget] = useState<string>("₹300");
  const abortControllerRef = useRef<AbortController | null>(null);

  const saveSearchToHistory = async (query: string, budget: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const path = "searches";
      await addDoc(collection(db, path), {
        query,
        budget,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      // Non-blocking error for history
      console.warn("Failed to save search history:", err);
    }
  };

  const search = async (perfumeName: string, budget: string = "₹300") => {
    if (!perfumeName.trim()) return;
    
    // Abort previous search if it's still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const cacheKey = `${perfumeName.toLowerCase()}-${budget}`;
    setLastQuery(perfumeName);
    setLastBudget(budget);

    // Save search if user logged in
    saveSearchToHistory(perfumeName, budget);

    // Speed up with cache
    if (searchHistoryCache[cacheKey]) {
      setData(searchHistoryCache[cacheKey]);
      setStatus("success");
      setError(null);
      return;
    }

    setStatus("loading");
    setData(null);
    setError(null);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // In this specific implementation, callGemini doesn't support signal directly 
      // but we handle the state update check below
      const raw = await callGemini(perfumeName, budget);
      
      // If the request was aborted, don't update state
      if (controller.signal.aborted) return;

      const parsed = parseResponse(raw);
      
      // Data Normalization: Ensure scores are valid numbers and other fields have fallbacks
      if (parsed && parsed.recommendations) {
        parsed.recommendations = parsed.recommendations.map((perfume: any) => ({
          ...perfume,
          similarityScore: typeof perfume.similarityScore === 'number' && !isNaN(perfume.similarityScore)
            ? Math.max(0, Math.min(100, perfume.similarityScore)) 
            : 0,
          whatMatches: perfume.whatMatches || [],
          whatDoesNot: perfume.whatDoesNot || [],
          availableOn: perfume.availableOn || []
        }));
      }

      if (!parsed) {
        throw new Error("PARSE_FAIL");
      }
      
      searchHistoryCache[cacheKey] = parsed;
      setData(parsed);
      setStatus("success");
    } catch (e: any) {
      if (controller.signal.aborted) return;
      
      console.error("Search Error:", e);
      if (e.message === "RATE_LIMIT") {
        setError("RATE_LIMIT");
      } else if (e.message === "PARSE_FAIL") {
        setError("PARSE_FAIL");
      } else if (e.message === "API_KEY_MISSING") {
        setError("API_KEY_MISSING: The fragrance intelligence engine is currently offline. Please notify the administrator to check the Gemini API configuration.");
      } else if (e.message === "EMPTY_RESPONSE") {
        setError("EMPTY_RESPONSE");
      } else if (e.message.startsWith("SEARCH_ERROR")) {
        setError(e.message);
      } else {
        setError("DEFAULT");
      }
      setStatus("error");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  };

  return { status, data, error, lastQuery, lastBudget, search };
}
