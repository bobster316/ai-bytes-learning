// ========================================
// JSON Repair Utility
// This function attempts to clean up common errors in AI-generated JSON
// ========================================

/**
 * Attempts to extract, clean, and repair broken or corrupted JSON strings from LLM output.
 *
 * Common issues fixed:
 * 1. Preamble/postamble text outside the main JSON object.
 * 2. Unescaped newlines, tabs, and control characters inside strings.
 * 3. Trailing commas in arrays or objects.
 * 4. Missing closing braces or brackets (if simple enough to detect).
 * 5. Comments (// or /* */) embedded in the JSON.
 *
 * @param corruptContent The raw string content from the AI response.
 * @returns A repaired JSON string, or the original if extraction fails.
 */
export function repairJsonString(corruptContent: string): string {
  if (!corruptContent) {
    return 'null';
  }

  let cleanedContent = corruptContent.trim();

  // 1. Remove preamble/postamble text to isolate the main JSON block
  const firstBraceIndex = cleanedContent.indexOf('{');
  const lastBraceIndex = cleanedContent.lastIndexOf('}');
  
  // If we can find both start and end braces, attempt extraction
  if (firstBraceIndex !== -1 && lastBraceIndex !== -1 && lastBraceIndex > firstBraceIndex) {
    cleanedContent = cleanedContent.substring(firstBraceIndex, lastBraceIndex + 1);
  } else if (firstBraceIndex !== -1 && lastBraceIndex === -1) {
    // If only the start brace is found, it might be a simple unclosed object. 
    // We add a closing brace as a desperate attempt.
    cleanedContent = cleanedContent.substring(firstBraceIndex) + '}';
  } else {
    // Cannot extract anything that looks like JSON
    return corruptContent; 
  }

  // 2. Remove JavaScript comments (single-line and multi-line)
  // This is a simple regex that may fail on complex nested structures but helps with LLM output
  cleanedContent = cleanedContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '').trim();

  // 3. Remove trailing commas, a very common LLM error
  // This regex matches a comma followed by one or more whitespace characters and a closing brace/bracket
  cleanedContent = cleanedContent.replace(/,(\s*[\]}])/g, '$1');

  // 4. Remove unescaped control characters and newlines within supposed string values (not key/value separators)
  // This is highly complex to do perfectly, so we use a safe-ish approach: remove standard JS-breaking control chars
  // WARNING: This is aggressive and might corrupt valid strings if they contain intentional unescaped control characters.
  cleanedContent = cleanedContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  return cleanedContent;
}

/**
 * Attempts to parse a potentially corrupt JSON string after cleaning.
 * @param corruptContent The raw string content from the AI response.
 * @returns The parsed JSON object, or null if parsing fails even after repair.
 */
export function parseAndRepairJson(corruptContent: string): any | null {
  const repairedContent = repairJsonString(corruptContent);

  try {
    return JSON.parse(repairedContent);
  } catch (initialError) {
    console.warn(`[JSON Repair] Failed to parse content even after initial repair. Raw: ${corruptContent.substring(0, 200)}...`);
    // Final attempt: sometimes the LLM wraps the JSON in a markdown block ```json ... ```
    if (repairedContent.startsWith('```') && repairedContent.endsWith('```')) {
        const extractedContent = repairedContent.substring(repairedContent.indexOf('{'), repairedContent.lastIndexOf('}') + 1);
        try {
            return JSON.parse(extractedContent);
        } catch (markdownError) {
            // Failed again, return null
        }
    }
    return null; 
  }
}