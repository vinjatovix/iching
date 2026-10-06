// Deterministic Seedable PRNG for procedural Shan-Shui generation

class PrngEngine {
  constructor() {
    this.s = 1234;
    this.p = 999979;
    this.q = 999983;
    this.m = this.p * this.q;
  }

  hash(x) {
    const str = typeof x === "string" ? x : JSON.stringify(x);
    let z = 0;
    for (let i = 0; i < str.length; i++) {
      z += str.charCodeAt(i) * Math.pow(128, i);
    }
    return z;
  }

  seed(x = 12345) {
    let y = 0;
    let z = 0;
    const redo = () => {
      y = (this.hash(x) + z) % this.m;
      z += 1;
    };
    while (y % this.p === 0 || y % this.q === 0 || y === 0 || y === 1) {
      redo();
    }
    this.s = y;
    for (let i = 0; i < 10; i++) {
      this.next();
    }
  }

  next() {
    this.s = (this.s * this.s) % this.m;
    return this.s / this.m;
  }
}

export const prng = new PrngEngine();

export function rand() {
  return prng.next();
}

export function randChoice(arr) {
  return arr[Math.floor(arr.length * rand())];
}

export function mapval(value, istart, istop, ostart, ostop) {
  return ostart + (ostop - ostart) * (((value - istart) * 1.0) / (istop - istart));
}

export function normRand(m, M) {
  return mapval(rand(), 0, 1, m, M);
}

export function wtrand(func) {
  const x = rand();
  const y = rand();
  if (y < func(x)) {
    return x;
  }
  return wtrand(func);
}

export function randGaussian() {
  return wtrand((x) => Math.pow(Math.E, -24 * Math.pow(x - 0.5, 2))) * 2 - 1;
}
