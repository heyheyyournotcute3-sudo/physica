/**
 * Deterministic xoshiro128** seeded PRNG for reproducible physics simulations.
 */
export interface SeededRng {
  next(): number; // [0, 1)
  range(min: number, max: number): number;
  gaussian(mean?: number, std?: number): number;
}

function splitmix32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x9e3779b9) >>> 0;
    let z = a;
    z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
    z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
    return (z ^ (z >>> 16)) >>> 0;
  };
}

export function createRng(seed = 137035999): SeededRng {
  const init = splitmix32(seed);
  let s0 = init();
  let s1 = init();
  let s2 = init();
  let s3 = init();
  if ((s0 | s1 | s2 | s3) === 0) s0 = 1;

  const rotl = (x: number, k: number) => ((x << k) | (x >>> (32 - k))) >>> 0;

  const nextUint32 = (): number => {
    const result = Math.imul(rotl(Math.imul(s1, 5) >>> 0, 7), 9) >>> 0;
    const t = (s1 << 9) >>> 0;
    s2 ^= s0;
    s3 ^= s1;
    s1 ^= s2;
    s0 ^= s3;
    s2 ^= t;
    s3 = rotl(s3, 11);
    return result;
  };

  let spareGaussian: number | null = null;

  const next = (): number => nextUint32() / 4294967296;

  return {
    next,
    range(min: number, max: number): number {
      return min + (max - min) * next();
    },
    gaussian(mean = 0, std = 1): number {
      if (spareGaussian !== null) {
        const val = spareGaussian;
        spareGaussian = null;
        return mean + std * val;
      }
      let u = 0;
      let v = 0;
      let s = 0;
      while (s === 0 || s >= 1) {
        u = next() * 2 - 1;
        v = next() * 2 - 1;
        s = u * u + v * v;
      }
      const mul = Math.sqrt((-2 * Math.log(s)) / s);
      spareGaussian = v * mul;
      return mean + std * u * mul;
    },
  };
}
