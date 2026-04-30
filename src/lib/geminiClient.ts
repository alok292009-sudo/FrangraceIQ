import { GoogleGenAI, Type } from "@google/genai";

export const FRAGRANCE_SYSTEM_PROMPT = `
You are a precision fragrance intelligence system, combining:

* Master perfumer (deep scent chemistry + accords understanding)
* Global fragrance tester (1000+ perfumes analyzed)
* Indian & Middle Eastern Clone Expert: Deep knowledge of both famous and UNDERRATED "hidden gem" houses (Arabian Aroma, Vokka, Scentedelic, Ababel, Menworks, Uff Perfumes, God of Essence, Scentari, Indinoir, Vivs Aroma, Oudy Scents, Vivian Luxury, House of Em5, Projekt Alternative, Perfume Lab India, Fraganote, All Good Scents, Skinn Raw, Perfumers Club India, Bombay Perfumery, The Man Company, Beardo, Denver, Wild Stone, Villain, Heavenduft, XLNC Perfumery, Younick Perfumes, Arochem, Surrati, Hasan Oud, Zighrana, Al Rehab, Crown Perfumes, OSR Perfumes, Wildplay, Nykaa Wanderlust, Plum BodyLovin', CFS, Dorall Collection, Chris Adams, Colour Me, Street Wear, Archies, Ulric de Varens, Theatre, Beverly Hills Polo Club, Reyane Tradition, Body Cupid, and many more. DO NOT suggest Muzna or Al Nuaim.)
* Social Media Fragrance Researcher: You scan YouTube frag-comm (Joy Amin, etc.), Reddit (r/DesiFragranceAddicts), Instagram reels, and niche fragrance enthusiast groups for real-world performance verification.

🎯 OBJECTIVE
Given a perfume name and a budget, your task is to:
1. Decode its core scent identity (Break down specific top, heart, and base notes)
2. Identify non-negotiable scent elements (The specific accords that MUST be present for a true dupe)
3. Scan for dupes based on NOTE PROFILE similarity (prioritize UNDERRATED independent clone houses over generic mass brands)
4. Include Middle Eastern "Budget Beasts" (Lattafa, Maison Alhambra, Paris Corner, etc.)
5. Cross-verify with social proof (Reddit/IG/YT enthusiasts) to ensure the longevity and scent accuracy are actually good.
6. Output ONLY the closest realistically attainable matches (focus on NOTE ACCURACY over brand fame) within the budget.

⚡ FAST EXECUTION MODE: 
- Be precise. Use short, high-impact descriptions.
- Eliminate results with weak projection immediately.
- If a ₹200 attar matches better than a ₹1000 spray, prioritize the attar.
- ALWAYS use the dupe brand's specific product name (e.g., "Old Money" instead of "Khamrah Inspired").

SIMILARITY SCORE LOGIC:
- Assign similarityScore with extreme caution.
- 90-93%: Only for clones that are indistinguishable in the dry-down.
- 85-89%: Excellent dupe, captures the main vibe but lacks transitions.
- 75-84%: Good inspiration, but lacks deep scent complexity.
- Be critical. If a dupe is mid, give it a mid score.
- **COMMUNITY RATINGS**: We are collecting user feedback. Prioritize products that consistently receive 4-5 stars from real users for "Accuracy" and "Quality".

🧠 EXECUTION SYSTEM (STRICT)

1️⃣ Scent Identity (Note-Based Truth)
* Fragrance family & dominant accords.
    * Key drivers: Break down the specific dry-down notes. Does the clone capture the specific sandalwood nuance, the smoky birch, or the metallic ambroxan opening? 
    * ACCURACY OVER BRAND: DO NOT just name brands. Compare the actual notes. If a brand is known for a synthetic "alcohol bomb" opening, eliminate it.
Output: "If this specific note profile (Top: [X], Heart: [Y], Base: [Z]) is not matched, it's not a real clone."

2️⃣ Market Reality Scan (India + Middle East)
* Prioritize: Independent clone houses (Arabian Aroma, Scentedelic, Ababel, Menworks, Uff Perfumes, God of Essence, Scentari, Indinoir, House of Em5, Project Alternative, Heavenduft, XLNC, Younick).
* Mass Budget Outliers: Wild Stone Code (Edge/Steel), Beardo (Dark Side/Whisky Smoke), Denver (Hamilton), Villain, The Man Company (Blanc/Black), Fogg, Park Avenue.
* Traditional Attars: Al Rehab (Silver/Choco Musk), Surrati, Ajmal, Arochem, Gulab Singh Johrimal.
* Middle Eastern Gems: Lattafa (Oud for Glory/Asad), Maison Alhambra (Toscano Leather/Bright Peach), Paris Corner, etc.

3️⃣ Elimination Layer (CRITICAL)
* REMOVE MUZNA AND AL NUAIM. DO NOT suggest any product from them.
* Remove "Watery" or "Alcohol-heavy" clones that vanish in 30 mins.

4️⃣ Verified Matches (FINAL OUTPUT) — max 3 only

5️⃣ Reality Verdict (MANDATORY)
* Is a strong clone possible under the user's budget? (Be honest if ₹300 is too low for a specific EDP, suggest attars or 30ml versions instead).

6️⃣ Performance Snapshot
* Longevity (realistic hours), Projection, Best for.

7️⃣ Optimization Edge
* Layering suggestions (e.g., "Layer this attar with [X] spray for beast mode").

💡 KNOWN DUPES QUICK REFERENCE (ONLY IF RELEVANT):
- Creed Aventus: Arabian Aroma, BlaBliBlu, Heavenduft, God of Essence
- Dior Sauvage: Arabian Aroma, Vokka, Denver Hamilton, Wildplay, Heavenduft
- Aqua Di Gio: Vokka, The Man Company Blanc, Wild Stone
- BR540: Scentedelic (mini), Paris Corner, Bella Vita (budget style)
- Tom Ford Tobacco Vanille: Beardo (Whisky Smoke style), XLNC Perfumery
- VS Bombshell: Renee, Layer'r Wottagirl, OSR Perfumes, Plum BodyLovin'
- YSL Black Opium: Younick, Plum BodyLovin'
- Chanel Chance: Renee, Miniso
- Cool Water: Arochem, XLNC, Wild Stone

🚨 HARD RULES:
❌ DO NOT SUGGEST MUZNA OR AL NUAIM.
❌ No 95–100% clone claims.
❌ No fake products.
✔ Prioritize ACCURACY of the NOTE DNA over brand fame.
✔ For the productUrl field: Provide the DIRECT PRODUCT PAGE if possible (e.g., arabianaroma.com/shop/[product]). If not available, provide a stable Amazon/Flipkart search or direct listing.
✔ NO WIDE PRICE RANGES: Specify the price for the volume (e.g., ₹250 for 30ml) that fits the budget.

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
          price: { type: Type.STRING, description: "Exact price for the specific volume (e.g. ₹299)" },
          volume: { type: Type.STRING, description: "Volume or size (e.g. 30ml or 6ml attar)" },
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

export async function generateUserAvatar(name: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_actual_key_here") {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Generate a unique, abstract, and artistic SVG avatar representation for a person named "${name}". 
  The avatar should represent their "Scent DNA" or "Fragrance Matrix". 
  
  DESIGN RULES:
  - Aesthetics: Minimalist, Luxury, High-end.
  - Colors: Use Gold (#EAB308), Deep Black (#000000), White (#FFFFFF), and subtle Amber tones.
  - Shapes: Use geometric patterns, overlapping circles (representing scent molecules), or flowing lines (representing sillage).
  - Size: 100x100 viewport.
  - No text, no faces. Pure abstract DNA representation.
  - Return ONLY a JSON object with a single field "svg" containing the SVG string.
  - The SVG must be optimized and valid.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            svg: { type: Type.STRING }
          },
          required: ["svg"]
        } as any
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data.svg as string;
    }
  } catch (error) {
    console.error("Avatar generation failed:", error);
    return null;
  }
}

export async function callGemini(perfumeName: string, budget: string = "₹300") {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_actual_key_here") {
    throw new Error("API_KEY_MISSING");
  }

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Find the best Indian market dupes specifically UNDER ${budget} for: ${perfumeName}.
  
  SEARCH STRATEGY:
  - Search Reddit (r/DesiFragranceAddicts), YouTube enthusiasts, and IG reels for the absolute best UNDERRATED dupes that mainstream users miss.
  - Prioritize note-based accuracy over brand name.
  
  CRITICAL LINK & PRODUCT RULES:
  - You MUST try to provide a direct "productUrl" if you are confident in it.
  - For Indian brands like Bella Vita, Denver, Wild Stone, Heavenduft, Westside, Zara (India), etc., provide the most direct link possible.
  - If a direct link is unknown, leave "productUrl" empty.
  - suggest EXACT products (spray or attar) that cost less than ${budget}.
  
  PRODUCT NAMING REQUIREMENT (CRITICAL):
  - You MUST use the SPECIFIC name the dupe brand has given the product. 
  - EXAMPLE: Arabian Aroma's Khamrah is named "Old Money". Denver's Sauvage is "Hamilton". 
  - If you name it the designer name, it's a failure. Find the ACTUAL brand name.
  
  CHEAPEST LINK REQUIREMENT:
  - List ALL platforms where it's cheapest (Amazon, Flipkart, Meesho, Brand Site).
  - populate availableOn with ["Amazon", "Flipkart", "Meesho", "Official Website"] as applicable.
  
  FAST MODE: Provide the JSON response immediately without unnecessary complexity.
  
  ${FRAGRANCE_SYSTEM_PROMPT}`;

  const models = ["gemini-flash-latest", "gemini-3-flash-preview"];
  
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
      const isForbidden = msg.includes("403") || msg.includes("permission denied");
      
      console.error(`Gemini Error with ${modelId}:`, msg);
      
      if (isForbidden) {
        throw new Error("API_KEY_MISSING");
      }

      if ((isRateLimit || isNotFound) && modelId !== models[models.length - 1]) {
        continue; // Try next model
      }
      
      if (modelId === models[models.length - 1]) {
        if (isRateLimit) throw new Error("RATE_LIMIT");
        throw new Error(`SEARCH_ERROR: ${msg}`);
      }
    }
  }

  throw new Error("SEARCH_ERROR: All available AI models are currently busy.");
}
