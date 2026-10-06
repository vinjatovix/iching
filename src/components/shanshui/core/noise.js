import { rand } from './prng.js';

class PerlinNoise {
  constructor() {
    this.PERLIN_YWRAPB = 4;
    this.PERLIN_YWRAP = 1 << this.PERLIN_YWRAPB;
    this.PERLIN_ZWRAPB = 8;
    this.PERLIN_ZWRAP = 1 << this.PERLIN_ZWRAPB;
    this.PERLIN_SIZE = 4095;
    this.perlin_octaves = 4;
    this.perlin_amp_falloff = 0.5;
    this.perlin = null;
  }

  scaled_cosine(i) {
    return 0.5 * (1.0 - Math.cos(i * Math.PI));
  }

  noise(x, y = 0, z = 0) {
    if (!this.perlin) {
      this.perlin = new Array(this.PERLIN_SIZE + 1);
      for (let i = 0; i < this.PERLIN_SIZE + 1; i++) {
        this.perlin[i] = rand();
      }
    }
    if (x < 0) x = -x;
    if (y < 0) y = -y;
    if (z < 0) z = -z;

    let xi = Math.floor(x);
    let yi = Math.floor(y);
    let zi = Math.floor(z);
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;
    let r = 0;
    let ampl = 0.5;

    for (let o = 0; o < this.perlin_octaves; o++) {
      let of = xi + (yi << this.PERLIN_YWRAPB) + (zi << this.PERLIN_ZWRAPB);
      const rxf = this.scaled_cosine(xf);
      const ryf = this.scaled_cosine(yf);
      let n1 = this.perlin[of & this.PERLIN_SIZE];
      n1 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n1);
      let n2 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n2 += rxf * (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n2);
      n1 += ryf * (n2 - n1);
      of += this.PERLIN_ZWRAP;
      n2 = this.perlin[of & this.PERLIN_SIZE];
      n2 += rxf * (this.perlin[(of + 1) & this.PERLIN_SIZE] - n2);
      let n3 = this.perlin[(of + this.PERLIN_YWRAP) & this.PERLIN_SIZE];
      n3 += rxf * (this.perlin[(of + this.PERLIN_YWRAP + 1) & this.PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);
      n1 += this.scaled_cosine(zf) * (n2 - n1);
      r += n1 * ampl;
      ampl *= this.perlin_amp_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;
      if (xf >= 1.0) { xi++; xf--; }
      if (yf >= 1.0) { yi++; yf--; }
      if (zf >= 1.0) { zi++; zf--; }
    }
    return r;
  }

  reset() {
    this.perlin = null;
  }
}

export const noise = new PerlinNoise();
