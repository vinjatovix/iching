import { rand, randChoice } from '../core/prng.js';
import { noise } from '../core/noise.js';
import { poly, stroke } from '../core/geom.js';
import { Tree } from './trees.js';

export function getFlatMountSurfaceY(x, xoff, yoff, seed, wid = 600, hei = 75) {
  const normX = (x - xoff) / wid;
  if (normX < -0.5 || normX > 0.5) return yoff;
  const rad = normX * Math.PI;
  const curve = Math.cos(rad);
  const n = noise.noise(rad + 10, 0, seed);
  return yoff - curve * hei * n;
}

export function getMountainSurfaceY(x, xoff, yoff, seed, wid = 500, hei = 340) {
  const normX = (x - xoff) / wid;
  if (normX < -0.5 || normX > 0.5) return yoff;
  const rad = normX * Math.PI;
  const curve = Math.cos(rad);
  const n = noise.noise(rad + 10, 0, seed);
  return yoff - curve * hei * n;
}

export function texture(ptlist, args = {}) {
  const xof = args.xof !== undefined ? args.xof : 0;
  const yof = args.yof !== undefined ? args.yof : 0;
  const tex = args.tex !== undefined ? args.tex : 400;
  const wid = args.wid !== undefined ? args.wid : 1.5;
  const len = args.len !== undefined ? args.len : 0.2;
  const sha = args.sha !== undefined ? args.sha : 0;
  const col = args.col !== undefined ? args.col : (() => `rgba(var(--ink-rgb),${(rand() * 0.35 + 0.1).toFixed(3)})`);
  const dis = args.dis !== undefined ? args.dis : (() => (rand() > 0.5 ? (1 / 3) * rand() : (2 / 3) + (1 / 3) * rand()));
  const reso = [ptlist.length, ptlist[0].length];
  const texlist = [];

  for (let i = 0; i < tex; i++) {
    const mid = (dis() * reso[1]) | 0;
    const hlen = Math.floor(rand() * (reso[1] * len));
    const start = Math.min(Math.max(mid - hlen, 0), reso[1]);
    const end = Math.min(Math.max(mid + hlen, 0), reso[1]);
    const layer = (i / tex) * (reso[0] - 1);

    texlist.push([]);
    for (let j = start; j < end; j++) {
      const p = layer - Math.floor(layer);
      const x = ptlist[Math.floor(layer)][j][0] * p + ptlist[Math.ceil(layer)][j][0] * (1 - p);
      const y = ptlist[Math.floor(layer)][j][1] * p + ptlist[Math.ceil(layer)][j][1] * (1 - p);
      const ns = [
        (30 / (layer + 1)) * (noise.noise(x, j * 0.5) - 0.5),
        (30 / (layer + 1)) * (noise.noise(y, j * 0.5) - 0.5),
      ];
      texlist[texlist.length - 1].push([x + ns[0], y + ns[1]]);
    }
  }

  let canv = "";
  if (sha) {
    for (let j = 0; j < texlist.length; j += 1 + (sha !== 0 ? 1 : 0)) {
      canv += stroke(
        texlist[j].map((x) => [x[0] + xof, x[1] + yof]),
        { col: "rgba(var(--ink-rgb),0.08)", wid: sha }
      );
    }
  }

  for (let j = 0 + sha; j < texlist.length; j += 1 + sha) {
    canv += stroke(
      texlist[j].map((x) => [x[0] + xof, x[1] + yof]),
      { col: col(j / texlist.length), wid }
    );
  }
  return canv;
}

export function foot(ptlist, args = {}) {
  const xof = args.xof !== undefined ? args.xof : 0;
  const yof = args.yof !== undefined ? args.yof : 0;
  const ftlist = [];
  const span = 10;
  let ni = 0;

  for (let i = 0; i < ptlist.length - 2; i++) {
    if (i === ni) {
      ni = Math.min(ni + randChoice([1, 2]), ptlist.length - 1);
      ftlist.push([]);
      ftlist.push([]);
      for (let j = 0; j < Math.min(ptlist[i].length / 8, 10); j++) {
        ftlist[ftlist.length - 2].push([
          ptlist[i][j][0] + noise.noise(j * 0.1, i) * 10,
          ptlist[i][j][1],
        ]);
        ftlist[ftlist.length - 1].push([
          ptlist[i][ptlist[i].length - 1 - j][0] - noise.noise(j * 0.1, i) * 10,
          ptlist[i][ptlist[i].length - 1 - j][1],
        ]);
      }

      ftlist[ftlist.length - 2] = ftlist[ftlist.length - 2].reverse();
      ftlist[ftlist.length - 1] = ftlist[ftlist.length - 1].reverse();
      for (let j = 0; j < span; j++) {
        const p = j / span;
        let y1 = ptlist[i][0][1] * (1 - p) + ptlist[ni][0][1] * p;
        let y2 = ptlist[i][ptlist[i].length - 1][1] * (1 - p) + ptlist[ni][ptlist[i].length - 1][1] * p;
        const vib = -1.7 * (p - 1) * Math.pow(p, 1 / 5);
        y1 += vib * 5 + noise.noise(xof * 0.05, i) * 5;
        y2 += vib * 5 + noise.noise(xof * 0.05, i) * 5;

        ftlist[ftlist.length - 2].push([ptlist[i][0][0] * (1 - p) + ptlist[ni][0][0] * p, y1]);
        ftlist[ftlist.length - 1].push([ptlist[i][ptlist[i].length - 1][0] * (1 - p) + ptlist[ni][ptlist[i].length - 1][0] * p, y2]);
      }
    }
  }

  let canv = "";
  for (let i = 0; i < ftlist.length; i++) {
    canv += poly(ftlist[i], { xof, yof, fil: "var(--bg-primary)", str: "none" });
  }
  for (let j = 0; j < ftlist.length; j++) {
    canv += stroke(
      ftlist[j].map((x) => [x[0] + xof, x[1] + yof]),
      { col: `rgba(var(--ink-rgb),${(0.1 + rand() * 0.1).toFixed(3)})`, wid: 1 }
    );
  }
  return canv;
}

export const Mount = {
  // Smooth, organic distant mountains WITHOUT vertical lines or abrupt cuts
  distMount(xoff, yoff, seed = 0, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 150;
    const len = args.len !== undefined ? args.len : 1700;
    const gradId = args.gradId !== undefined ? args.gradId : null;
    const strokeAlpha = args.strokeAlpha !== undefined ? args.strokeAlpha : 0.32;
    const step = 8;
    const totalSteps = Math.floor(len / step);

    const topRidge = [];
    const bottomLine = [];

    for (let i = 0; i <= totalSteps; i++) {
      const x = xoff + i * step;
      const t = i / totalSteps;
      // Smooth sine envelope ensures natural tapering to 0 at both edges (no abrupt cuts)
      const env = Math.pow(Math.sin(t * Math.PI), 0.65);
      const n = noise.noise(t * 3.5 + 2, seed * 0.1) * 0.7 + noise.noise(t * 8.5 + 5, seed * 0.2) * 0.3;
      const yTop = yoff - hei * n * env;
      topRidge.push([x, yTop]);

      const yBot = yoff + 18 * noise.noise(t * 3.0, 2, seed) * env;
      bottomLine.push([x, yBot]);
    }

    const fullSilhouette = topRidge.concat(bottomLine.slice().reverse());
    let canv = "";

    // 1. Occlusion background
    canv += poly(fullSilhouette, { fil: "var(--bg-primary)", str: "none" });

    // 2. Soft ink wash fill with misty gradient fading down
    const fillCol = gradId ? `url(#${gradId})` : "rgba(var(--ink-rgb),0.13)";
    canv += poly(fullSilhouette, {
      fil: fillCol,
      str: "none",
    });

    // 3. Delicate top crest stroke following the mountain ridge
    canv += stroke(topRidge, {
      col: `rgba(var(--ink-rgb),${strokeAlpha})`,
      wid: 1.3,
      noi: 0.35,
    });

    return canv;
  },

  mountain(xoff, yoff, seed = 0, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 300;
    const wid = args.wid !== undefined ? args.wid : 500;
    const tex = args.tex !== undefined ? args.tex : 200;
    const veg = args.veg !== undefined ? args.veg : true;
    const col = args.col !== undefined ? args.col : undefined;

    let canv = "";
    const ptlist = [];
    const reso = [10, 50];
    let hoff = 0;

    for (let j = 0; j < reso[0]; j++) {
      hoff += (rand() * yoff) / 100;
      ptlist.push([]);
      for (let i = 0; i < reso[1]; i++) {
        const x = (i / reso[1] - 0.5) * Math.PI;
        let y = Math.cos(x);
        y *= noise.noise(x + 10, j * 0.15, seed);
        const p = 1 - j / reso[0];
        ptlist[ptlist.length - 1].push([(x / Math.PI) * wid * p, -y * hei * p + hoff]);
      }
    }

    const vegetate = (treeFunc, growthRule) => {
      for (let i = 0; i < ptlist.length; i++) {
        for (let j = 0; j < ptlist[i].length; j++) {
          if (growthRule(i, j)) {
            canv += treeFunc(ptlist[i][j][0], ptlist[i][j][1]);
          }
        }
      }
    };

    // RIM TREES
    vegetate(
      (x, y) => Tree.tree02(x + xoff, y + yoff - 5, { clu: 2 }),
      (i, j) => {
        const ns = noise.noise(j * 0.1, seed);
        return i === 0 && ns * ns * ns < 0.1 && Math.abs(ptlist[i][j][1]) / hei > 0.2;
      }
    );

    // Occlusion background
    canv += poly(ptlist[0].concat([[0, reso[0] * 4]]), {
      xof: xoff,
      yof: yoff,
      fil: "var(--bg-primary)",
      str: "none",
    });

    // Main silhouette outline stroke
    canv += stroke(
      ptlist[0].map((x) => [x[0] + xoff, x[1] + yoff]),
      { col: "rgba(var(--ink-rgb),0.35)", noi: 1, wid: 2.8 }
    );

    canv += foot(ptlist, { xof: xoff, yof: yoff });
    canv += texture(ptlist, {
      xof: xoff,
      yof: yoff,
      tex,
      sha: randChoice([0, 0, 0, 5]),
      col,
    });

    // TOP TREES
    vegetate(
      (x, y) => Tree.tree02(x + xoff, y + yoff, {}),
      (i, j) => {
        const ns = noise.noise(i * 0.1, j * 0.1, seed + 2);
        return ns * ns * ns < 0.1 && Math.abs(ptlist[i][j][1]) / hei > 0.5;
      }
    );

    if (veg) {
      // MIDDLE CREVICE TREES
      vegetate(
        (x, y) => {
          let ht = ((hei + y) / hei) * 60;
          ht = ht * 0.3 + rand() * ht * 0.7;
          return Tree.tree01(x + xoff, y + yoff, {
            hei: ht,
            wid: rand() * 3 + 1,
          });
        },
        (i, j) => {
          const ns = noise.noise(i * 0.2, j * 0.05, seed);
          return j % 2 && ns * ns * ns * ns < 0.012 && Math.abs(ptlist[i][j][1]) / hei < 0.3;
        }
      );
    }

    return canv;
  },

  flatMount(xoff, yoff, seed = 0, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 80;
    const wid = args.wid !== undefined ? args.wid : 600;
    const tex = args.tex !== undefined ? args.tex : 120;

    let canv = "";
    const ptlist = [];
    const reso = [5, 40];
    let hoff = 0;

    for (let j = 0; j < reso[0]; j++) {
      hoff += (rand() * yoff) / 200;
      ptlist.push([]);
      for (let i = 0; i < reso[1]; i++) {
        const x = (i / reso[1] - 0.5) * Math.PI;
        let y = Math.cos(x);
        y *= noise.noise(x + 10, j * 0.15, seed);
        const p = 1 - j / reso[0];
        ptlist[ptlist.length - 1].push([(x / Math.PI) * wid * p, -y * hei * p + hoff]);
      }
    }

    canv += poly(ptlist[0].concat([[0, reso[0] * 4]]), {
      xof: xoff,
      yof: yoff,
      fil: "var(--bg-primary)",
      str: "none",
    });

    canv += stroke(
      ptlist[0].map((x) => [x[0] + xoff, x[1] + yoff]),
      { col: "rgba(var(--ink-rgb),0.35)", noi: 1, wid: 2.5 }
    );

    canv += texture(ptlist, {
      xof: xoff,
      yof: yoff,
      tex,
      wid: 1.2,
      len: 0.15,
    });

    return canv;
  },

  rock(xoff, yoff, seed = 0, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 40;
    const wid = args.wid !== undefined ? args.wid : 60;
    const tex = args.tex !== undefined ? args.tex : 30;

    let canv = "";
    const ptlist = [];
    const reso = [6, 20];

    for (let j = 0; j < reso[0]; j++) {
      ptlist.push([]);
      for (let i = 0; i < reso[1]; i++) {
        const x = (i / reso[1] - 0.5) * Math.PI;
        let y = Math.cos(x) * noise.noise(x + 5, j * 0.2, seed);
        const p = 1 - j / reso[0];
        ptlist[ptlist.length - 1].push([(x / Math.PI) * wid * p, -y * hei * p]);
      }
    }

    canv += poly(ptlist[0].concat([[0, 0]]), {
      xof: xoff,
      yof: yoff,
      fil: "var(--bg-primary)",
      str: "none",
    });

    canv += stroke(
      ptlist[0].map((x) => [x[0] + xoff, x[1] + yoff]),
      { col: "rgba(var(--ink-rgb),0.4)", noi: 0.8, wid: 2 }
    );

    canv += texture(ptlist, {
      xof: xoff,
      yof: yoff,
      tex,
      wid: 1.5,
    });

    return canv;
  },
};
