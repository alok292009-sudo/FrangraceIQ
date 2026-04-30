
export function parseResponse(raw: string) {
  try {
    // Try to find the JSON part if the model included extra text
    const jsonStart = raw.indexOf('{');
    const jsonEnd = raw.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonContent = raw.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonContent);
    }
    // Fallback to original logic
    const cleaned = raw.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Parse Error:", e);
    return null;
  }
}
