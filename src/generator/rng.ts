export type RNG = {
  seed: number;
};

/**
 * Детерминированный генератор случайных чисел (mulberry32)
 * Используется как базовый RNG по seed
 */
export function mulberry32(seed: number): RNG {
  return { seed };
}

/**
 * Псевдослучайное число от 0 до 1
 */
export function rand(rng: RNG): number {
  rng.seed |= 0;
  rng.seed = (rng.seed + 0x6d2b79f5) | 0;
  let t = Math.imul(rng.seed ^ (rng.seed >>> 15), 1 | rng.seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/**
 * Случайное целое число от min до max включительно
 */
export function randInt(rng: RNG, min: number, max: number): number {
  return Math.floor(rand(rng) * (max - min + 1)) + min;
}

/**
 * Случайный элемент массива (поддерживает readonly массивы)
 */
export function pick<T>(rng: RNG, arr: readonly T[]): T {
  return arr[randInt(rng, 0, arr.length - 1)];
}
