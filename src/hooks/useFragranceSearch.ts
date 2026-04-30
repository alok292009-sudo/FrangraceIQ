
import { useState } from "react";
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

  const search = async (perfumeName: string, budget: string = "₹300") => {
    if (!perfumeName.trim() || status === "loading") return;
    
    const cacheKey = `${perfumeName.toLowerCase()}-${budget}`;
    setLastQuery(perfumeName);
    setLastBudget(budget);

    if (searchHistoryCache[cacheKey]) {
      setData(searchHistoryCache[cacheKey]);
      setStatus("success");
      setError(null);
      return;
    }

    setStatus("loading");
    setData(null);
    setError(null);

    try {
      const raw = await callGemini(perfumeName, budget);
      const parsed = parseResponse(raw);
      
      if (!parsed) {
        throw new Error("PARSE_FAIL");
      }
      
      searchHistoryCache[cacheKey] = parsed;
      setData(parsed);
      setStatus("success");
    } catch (e: any) {
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
    }
  };

  return { status, data, error, lastQuery, lastBudget, search };
}
