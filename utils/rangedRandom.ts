/**
 * Generates a random integer in the specified range
 * @param {number} min - lower boundary
 * @param {number} max - upper boundary
 * @return {number}
 */
export default function rangedRandom(min: number, max: number): number {
  return Math.floor((Math.random() * (max - min)) + min);
}
