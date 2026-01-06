/**
 * Extracts JSON from a string that may be wrapped in markdown code blocks
 */
export function extractJSON(text: string): string {
  let jsonText = text.trim();

  // Try to extract from markdown code blocks (handles ```json, ``` json, or just ```)
  const codeBlockMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    jsonText = codeBlockMatch[1].trim();
  } else {
    // Fallback: try to find JSON array or object directly
    const jsonStartArray = jsonText.indexOf('[');
    const jsonStartObject = jsonText.indexOf('{');

    if (jsonStartArray !== -1 || jsonStartObject !== -1) {
      // Find which comes first
      let start = -1;

      if (jsonStartArray !== -1 && (jsonStartObject === -1 || jsonStartArray < jsonStartObject)) {
        start = jsonStartArray;
      } else if (jsonStartObject !== -1) {
        start = jsonStartObject;
      }

      if (start !== -1) {
        // Find the matching closing bracket/brace
        let depth = 0;
        let inString = false;
        let escaped = false;

        for (let i = start; i < jsonText.length; i++) {
          const char = jsonText[i];

          if (escaped) {
            escaped = false;
            continue;
          }

          if (char === '\\') {
            escaped = true;
            continue;
          }

          if (char === '"') {
            inString = !inString;
            continue;
          }

          if (inString) continue;

          if (char === '[' || char === '{') depth++;
          if (char === ']' || char === '}') depth--;

          if (depth === 0) {
            jsonText = jsonText.slice(start, i + 1);
            break;
          }
        }
      }
    }
  }

  return jsonText;
}
