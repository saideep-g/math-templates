/**
 * Normalizes user input for math comparisons (fractions, mixed numbers, decimals).
 * Example: "1 1/2" -> 1.5, "3/2" -> 1.5, "1.5" -> 1.5
 */
export const normalizeFraction = (val: string | number | undefined): number | null => {
  if (val === undefined || val === null || val === '') return null;
  const s = String(val).trim().replace(/\\/g, ''); // Remove latex backslashes

  // Handle mixed numbers "1 1/2"
  const mixedMatch = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const [_, whole, num, den] = mixedMatch;
    return Number(whole) + Number(num) / Number(den);
  }

  // Handle standard fractions "3/2"
  const fracMatch = s.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    const [_, num, den] = fracMatch;
    return Number(num) / Number(den);
  }

  // Handle simple numbers/decimals
  const num = Number(s);
  return isNaN(num) ? null : num;
};