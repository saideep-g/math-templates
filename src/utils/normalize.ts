/**
 * Utility to normalize various math inputs for Grade 7 learners.
 * Handles fractions, mixed numbers, and cleans basic LaTeX strings.
 * Refined for robust "equivalence" scoring.
 */
export const normalizeFraction = (input: string | number | undefined | null): number | null => {
  if (input === undefined || input === null) return null;
  
  // Clean string and convert LaTeX fractions to standard ones for comparison
  // Example: \frac{9}{8} -> 9/8
  let str = String(input).trim().toLowerCase()
    .replace(/\\frac\{/g, '')
    .replace(/\}\{/g, '/')
    .replace(/\}/g, '')
    .replace(/\\boxed\{/g, '')
    .replace(/\$/g, '');

  if (str === "") return null;

  // Handle Mixed Numbers: "1 1/8"
  const mixedMatch = str.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const [_, whole, num, den] = mixedMatch;
    const denominator = parseFloat(den);
    return denominator !== 0 ? parseFloat(whole) + parseFloat(num) / denominator : null;
  }

  // Handle Simple Fractions: "9/8"
  const fractionMatch = str.match(/^(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const [_, num, den] = fractionMatch;
    const denominator = parseFloat(den);
    return denominator !== 0 ? parseFloat(num) / denominator : null;
  }

  // Fallback to basic float
  const val = parseFloat(str);
  return isNaN(val) ? null : val;
};