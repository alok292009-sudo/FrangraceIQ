
export function parseResponse(raw: string) {
  if (!raw) return null;

  try {
    // 1. Try direct parse first
    return JSON.parse(raw.trim());
  } catch (e) {
    // 2. Try to extract JSON between first { and its matching }
    const firstBrace = raw.indexOf('{');
    if (firstBrace === -1) {
      console.error("No JSON found in response");
      return null;
    }

    let braceCount = 0;
    let endBrace = -1;
    let inString = false;
    let escape = false;

    for (let i = firstBrace; i < raw.length; i++) {
      const char = raw[i];
      if (char === '"' && !escape) {
        inString = !inString;
      }
      if (!inString) {
        if (char === '{') braceCount++;
        if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endBrace = i;
            break;
          }
        }
      }
      escape = char === '\\' && !escape;
    }

    if (endBrace !== -1) {
      const jsonContent = raw.substring(firstBrace, endBrace + 1);
      try {
        return JSON.parse(jsonContent);
      } catch (innerError) {
        console.error("Partial JSON match failed to parse:", innerError);
      }
    }

    // 3. Last ditch effort: strip markdown and try to parse
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (lastError) {
      console.error("Final parse attempt failed:", lastError);
      return null;
    }
  }
}
