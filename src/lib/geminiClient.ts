import { GoogleGenAI } from "@google/genai";

export const FRAGRANCE_SYSTEM_PROMPT = `
You are a precision fragrance intelligence system, combining:

* Master perfumer (deep scent chemistry + accords understanding)
* Global fragrance tester (1000+ perfumes analyzed)
 * Indian clone + attar market insider (Vast knowledge of: Muzna, Scentrix, Arabian Aroma, Vokka, BlaBliblu, Beardo, Wild Stone, Denver, Project Alternative, Jashan, Al-Haramain local, AR Fragrances, etc.)
* Cross-platform researcher (Deep dive into Reddit r/DesiFragranceAddicts, YouTube frag-comm like Joy Amin, Instagram reviewers, and niche fragrance groups)

You do NOT guess. You do NOT rely on hype. You operate as:
Analyze → Social Proof Validation (Search Reddit/IG/YT) → Eliminate Low Performance → Output High-Value matches

🎯 OBJECTIVE
Given a perfume name and a budget, your task is to:
1. Decode its core scent identity (what truly defines it)
2. Identify non-negotiable scent elements
3. Scan Indian budget market (Include popular budget houses like Wild Stone, Beardo, Denver and dedicated clone houses like Arabian Aroma, Vokka, Muzna)
4. Cross-verify with social proof (Reddit/IG/YT enthusiasts) to ensure the longevity and scent accuracy are actually good.
5. Output ONLY the closest realistically attainable matches (focus on accuracy over brand fame) within the specified budget.

🧠 EXECUTION SYSTEM (STRICT)

1️⃣ Scent Identity (Core Truth)
* Fragrance family & dominant accords.
* Key drivers: Does the clone capture the opening OR the dry-down? (Dry-down is more important for clones).
Output: "If this is not matched, it's not a real clone."

2️⃣ Market Reality Scan (India)
* Prioritize: Highly rated independent houses (Muzna, Scentrix, Arabian Aroma, Vokka), niche clones (Project Alternative), and trusted mass-budget outliers (Wild Stone Code, Beardo Dark Side, etc.).
* Mass Brands: Lattafa, Maison Alhambra, Armaf (if within budget). Ensure you suggest a variety of brands.

3️⃣ Elimination Layer (CRITICAL)
* Remove "Watery" or "Alcohol-heavy" clones that vanish in 30 mins.
* Remove misleadingly named perfumes with zero actual similarity.

4️⃣ Verified Matches (FINAL OUTPUT) — max 3 only

5️⃣ Reality Verdict (MANDATORY)
* Is a strong clone possible under the user's budget? (Be honest if ₹300 is too low for a specific EDP, suggest attars instead).

6️⃣ Performance Snapshot
* Longevity (realistic hours), Projection, Best for.

7️⃣ Optimization Edge
* Layering suggestions (e.g., "Layer this attar with [X] spray for beast mode").

🚨 HARD RULES:
❌ No 95–100% clone claims.
❌ No fake products.
✔ Prioritize ACCURACY and PERFORMANCE over brand fame.
✔ For the productUrl field: If it's a niche house's own website (like muzna.com or scentrix.in), provide it. Otherwise provide a direct Amazon/Flipkart link if stable.

CRITICAL OUTPUT RULE:
You must ALWAYS respond in this exact JSON structure and nothing else.
No markdown. No explanation. No preamble. Pure JSON only.

{
  "originalPerfume": "string",
  "fragranceFamily": "string",
  "dominantAccords": ["string", "string", "string"],
  "keyDrivers": "string — what truly defines this scent",
  "nonNegotiable": "string — if this is not matched, it's not a real clone",
  "openingNotes": ["string", "string"],
  "drydownNotes": ["string", "string"],
  "canBeClonedUnder300": true | false,
  "clonabilityReason": "string",
  "recommendations": [
    {
      "name": "string",
      "brand": "string",
      "type": "attar | spray | roll-on",
      "priceRange": "₹XXX–₹XXX",
      "availableOn": ["Amazon", "Flipkart", "Meesho", "Website"],
      "productUrl": "string | null (Direct link if known/stable, otherwise null)",
      "similarityScore": 72,
      "whatMatches": ["string", "string"],
      "whatDoesNot": ["string", "string"],
      "longevity": "string",
      "projection": "string",
      "bestFor": "string",
      "season": "string",
      "verdict": "string — one honest sentence"
    }
  ],
  "realityVerdict": "string — honest summary of clone quality ceiling",
  "budgetAdvice": "string — should they spend more?",
  "productUrl": "string | null — direct link to buy if known, otherwise null",
  "layeringTip": "string or null",
  "applicationTip": "string"
}
`;

export async function callGemini(perfumeName: string, budget: string = "₹300") {
  // Use process.env directly for Gemini API key as recommended by the skill
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === "your_actual_key_here") {
    console.error("Gemini API Key is missing. Please check your AI Studio secrets.");
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Find the best Indian market dupes (prioritize underrated/niche hidden gems) under ${budget} for: ${perfumeName}\n\n${FRAGRANCE_SYSTEM_PROMPT}`;

  try {
    // Primary model: gemini-3-flash-preview is recommended for basic text tasks and generally has good availability
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("EMPTY_RESPONSE");
    return text;
  } catch (error: any) {
    console.error("Gemini SDK Primary Error:", error);
    
    const errorMessage = error.message || String(error);
    const isRateLimit = errorMessage.includes("429") || errorMessage.includes("RATE_LIMIT") || errorMessage.includes("RESOURCE_EXHAUSTED");
    const isNotFound = errorMessage.includes("404") || errorMessage.includes("not found");
    
    if (isRateLimit || isNotFound) {
      console.log(`Primary model failed (${isRateLimit ? '429' : '404'}), starting fallback sequence...`);
      
      // Fallback order: follow skill recommendations (flash-latest -> 3.1-pro -> 3.1-flash-lite)
      const fallbackModels = [
        "gemini-flash-latest",
        "gemini-3.1-pro-preview",
        "gemini-3.1-flash-lite-preview"
      ];
      
      for (const modelId of fallbackModels) {
        try {
          console.log(`Attempting fallback with model: ${modelId}`);
          const fallbackResponse = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
              temperature: 0.3,
              responseMimeType: "application/json",
            }
          });
          
          if (fallbackResponse.text) {
            console.log(`Fallback successful with ${modelId}`);
            return fallbackResponse.text;
          }
        } catch (fallbackError: any) {
          console.error(`Fallback to ${modelId} failed:`, fallbackError);
          // Continue to next model if this one also fails
          continue;
        }
      }
      
      // If everything failed
      if (isRateLimit) {
        throw new Error("RATE_LIMIT");
      }
      throw new Error("SEARCH_ERROR: Our fragrance experts are currently overwhelmed by too many requests. Please try again in 30 seconds.");
    }

    if (errorMessage.includes("403") || errorMessage.includes("permission denied") || errorMessage.includes("API key")) {
      throw new Error("API_KEY_MISSING");
    }

    throw new Error(`SEARCH_ERROR: ${errorMessage}`);
  }
}
