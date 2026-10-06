import { rand } from '../core/prng.js';
import { noise } from '../core/noise.js';
import { stroke } from '../core/geom.js';

export function water(xoff, yoff, seed = 0, args = {}) {
  const hei = args.hei !== undefined ? args.hei : 1.5;
  const len = args.len !== undefined ? args.len : 600;
  const clu = args.clu !== undefined ? args.clu : 3;
  let canv = "";

  const ptlist = [];
  let yk = 0;

  for (let i = 0; i < clu; i++) {
    ptlist.push([]);
    const xk = (rand() - 0.5) * (len * 0.15);
    // Generous vertical spacing so ripples breathe and don't clump together
    yk += 22 + rand() * 12;
    const lk = len * 0.35 + rand() * (len * 0.25);
    const reso = 10;

    for (let j = -lk; j < lk; j += reso) {
      // Gentle, low-frequency subtle water ripple
      const wave = Math.sin(j * 0.045) * hei * (noise.noise(j * 0.02 + i, seed) * 0.8 + 0.4);
      ptlist[ptlist.length - 1].push([j + xk, wave + yk]);
    }
  }

  for (let j = 0; j < ptlist.length; j++) {
    if (ptlist[j].length > 2) {
      canv += stroke(
        ptlist[j].map((x) => [x[0] + xoff, x[1] + yoff]),
        {
          col: `rgba(var(--ink-rgb),${(0.18 + rand() * 0.12).toFixed(3)})`,
          wid: 0.75,
          fun: (t) => Math.sin(t * Math.PI),
        }
      );
    }
  }

  return canv;
}
