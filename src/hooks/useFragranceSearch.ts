
import { useState, useRef } from "react";
import { callGemini } from "../lib/geminiClient";
import { parseResponse } from "../lib/responseParser";

export type SearchStatus = "idle" | "loading" | "success" | "error";

const searchHistoryCache: Record<string, any> = {};

export function useFragranceSearch() {
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [lastBudget, setLastBudget] = useState<string>("₹300");
  const abortControllerRef = useRef<AbortController | null>(null);

  const search = async (perfumeName: string, budget: string = "₹300") => {
    if (!perfumeName.trim()) return;
    
    // Abort previous search if it's still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const cacheKey = `${perfumeName.toLowerCase()}-${budget}`;
    setLastQuery(perfumeName);
    setLastBudget(budget);

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
        setError("API_KEY_MISSING");
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
