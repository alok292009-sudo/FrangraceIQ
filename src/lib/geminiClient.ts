import { GoogleGenAI, Type } from "@google/genai";

export const FRAGRANCE_SYSTEM_PROMPT = `
You are a precision fragrance intelligence system, combining:

* Master perfumer (deep scent chemistry + accords understanding)
* Global fragrance tester (1000+ perfumes analyzed)
 * Indian clone + attar market insider (Vast knowledge of: Arabian Aroma, Vokka, Muzna, Scentedelic, Ababel, Menworks, Uff Perfumes, God of Essence, Scentari, Indinoir, Vivs Aroma, Oudy Scents, Vivian Luxury, House of Em5, Projekt Alternative, Perfume Lab India, Fraganote, All Good Scents, Skinn Raw, Perfumers Club India, Bombay Perfumery, The Man Company, Beardo, Denver, Wild Stone, Denver, Villain, etc.)
* Cross-platform researcher (Deep dive into Reddit r/DesiFragranceAddicts, YouTube frag-comm like Joy Amin, Instagram reviewers, and niche fragrance groups)

You do NOT guess. You do NOT rely on hype. You operate as:
Analyze → Social Proof Validation (Search Reddit/IG/YT) → Eliminate Low Performance → Output High-Value matches

🎯 OBJECTIVE
Given a perfume name and a budget, your task is to:
1. Decode its core scent identity (what truly defines it)
2. Identify non-negotiable scent elements
3. Scan Indian budget market (Include independent clone houses like Muzna, Arabian Aroma, Scentedelic, etc.)
4. Include Middle Eastern "Budget Beasts" if within budget (Lattafa, Maison Alhambra, Paris Corner, Pendora Scents, Ard Al Zaafaran, Al Haramain, Rasasi, Swiss Arabian, Afnan, Fragrance World, Riiffs, Ajyad, Nylaa, Khalis, Emper).
5. Cross-verify with social proof (Reddit/IG/YT enthusiasts) to ensure the longevity and scent accuracy are actually good.
6. Output ONLY the closest realistically attainable matches (focus on accuracy over brand fame) within the specified budget.

🧠 EXECUTION SYSTEM (STRICT)

1️⃣ Scent Identity (Core Truth)
* Fragrance family & dominant accords.
* Key drivers: Does the clone capture the opening OR the dry-down? (Dry-down is more important for clones).
Output: "If this is not matched, it's not a real clone."

2️⃣ Market Reality Scan (India + Middle East)
* Prioritize: Independent clone houses (Muzna, Arabian Aroma, Scentedelic, Ababel, Menworks, Uff Perfumes, God of Essence, Scentari, Indinoir, House of Em5, Project Alternative).
* Mass Budget Outliers: Wild Stone Code, Beardo, Denver, Villain.
* Middle Eastern Gems: Lattafa, Maison Alhambra, Paris Corner, etc.

3️⃣ Elimination Layer (CRITICAL)
* Remove "Watery" or "Alcohol-heavy" clones that vanish in 30 mins.
* Remove misleadingly named perfumes with zero actual similarity.

4️⃣ Verified Matches (FINAL OUTPUT) — max 3 only

5️⃣ Reality Verdict (MANDATORY)
* Is a strong clone possible under the user's budget? (Be honest if ₹300 is too low for a specific EDP, suggest attars or 30ml versions instead).

6️⃣ Performance Snapshot
* Longevity (realistic hours), Projection, Best for.

7️⃣ Optimization Edge
* Layering suggestions (e.g., "Layer this attar with [X] spray for beast mode").

🚨 HARD RULES:
❌ No 95–100% clone claims.
❌ No fake products.
✔ Prioritize ACCURACY and PERFORMANCE over brand fame.
✔ For the productUrl field: Provide the DIRECT PRODUCT PAGE if possible (e.g., muznafragrances.in/products/[slug] or arabianaroma.com/shop/[product]). If not available, provide a stable Amazon/Flipkart search or direct listing.
✔ NO WIDE PRICE RANGES: Do not say ₹150–₹1000. Specify the price for the volume (e.g., ₹250 for 30ml) that fits the budget.

CRITICAL OUTPUT RULE:
You must ALWAYS respond in this exact JSON structure and nothing else.
No markdown. No explanation. No preamble. Pure JSON only.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    originalPerfume: { type: Type.STRING },
    fragranceFamily: { type: Type.STRING },
    dominantAccords: { type: Type.ARRAY, items: { type: Type.STRING } },
    keyDrivers: { type: Type.STRING },
    nonNegotiable: { type: Type.STRING },
    openingNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
    drydownNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
    canBeClonedUnder300: { type: Type.BOOLEAN },
    clonabilityReason: { type: Type.STRING },
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          brand: { type: Type.STRING },
          type: { type: Type.STRING },
          priceRange: { type: Type.STRING },
          availableOn: { type: Type.ARRAY, items: { type: Type.STRING } },
          productUrl: { type: Type.STRING },
          similarityScore: { type: Type.NUMBER },
          whatMatches: { type: Type.ARRAY, items: { type: Type.STRING } },
          whatDoesNot: { type: Type.ARRAY, items: { type: Type.STRING } },
          longevity: { type: Type.STRING },
          projection: { type: Type.STRING },
          bestFor: { type: Type.STRING },
          season: { type: Type.STRING },
          verdict: { type: Type.STRING }
        }
      }
    },
    realityVerdict: { type: Type.STRING },
    budgetAdvice: { type: Type.STRING },
    productUrl: { type: Type.STRING },
    layeringTip: { type: Type.STRING },
    applicationTip: { type: Type.STRING }
  },
  required: ["originalPerfume", "recommendations"]
};

export async function callGemini(perfumeName: string, budget: string = "₹300") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_actual_key_here") {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Find the best Indian market dupes specifically UNDER ${budget} for: ${perfumeName}.
  
  STRICT BUDGET RULES:
  - suggest EXACT products (spray or attar) that cost less than ${budget}.
  - prioritize brands: Arabian Aroma, Muzna, Vokka, Scentedelic, Ababel, Lattafa, Maison Alhambra, etc.
  
  DIRECT BUYING REQUIREMENT:
  - You MUST try to find the direct product URL on the brand's website (e.g., muznafragrances.in, arabianaroma.com, vokkafragrances.com, projectalternative.com).
  - If it's a mass brand, use a direct Amazon/Flipkart/Meesho product page.
  - DO NOT give a generic store link if a product link exists.
  
  ${FRAGRANCE_SYSTEM_PROMPT}`;

  const models = ["gemini-3-flash-preview", "gemini-2.0-flash", "gemini-flash-latest"];
  
  for (const modelId of models) {
    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          temperature: 0.3,
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA as any
        }
      });

      if (response.text) return response.text;
    } catch (error: any) {
      const msg = error.message || String(error);
      const isRateLimit = msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");
      const isNotFound = msg.includes("404") || msg.includes("not found");
      
      console.error(`Gemini Error with ${modelId}:`, msg);
      
      if (isRateLimit && modelId !== models[models.length - 1]) {
        continue; // Try next model on rate limit
      }
      
      if (isNotFound) {
        continue; // Try next model on 404
      }

      if (modelId === models[models.length - 1]) {
        if (isRateLimit) throw new Error("RATE_LIMIT");
        throw new Error(`SEARCH_ERROR: ${msg}`);
      }
    }
  }

  throw new Error("SEARCH_ERROR: All available AI models are currently busy.");
}
