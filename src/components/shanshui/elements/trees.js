import { rand, randChoice, randGaussian } from '../core/prng.js';
import { noise } from '../core/noise.js';
import { poly, stroke, blob, div, loopNoise } from '../core/geom.js';

export function getInkColor(alpha = 0.7) {
  return `rgba(var(--ink-rgb),${alpha})`;
}

export function branch(args = {}) {
  const hei = args.hei !== undefined ? args.hei : 300;
  const wid = args.wid !== undefined ? args.wid : 6;
  const ang = args.ang !== undefined ? args.ang : 0;
  const det = args.det !== undefined ? args.det : 10;
  const ben = args.ben !== undefined ? args.ben : Math.PI * 0.2;

  let nx = 0;
  let ny = 0;
  const tlist = [[nx, ny]];
  let a0 = 0;
  const g = 3;
  for (let i = 0; i < g; i++) {
    a0 += (ben / 2 + (rand() * ben) / 2) * randChoice([-1, 1]);
    nx += (Math.cos(a0) * hei) / g;
    ny -= (Math.sin(a0) * hei) / g;
    tlist.push([nx, ny]);
  }
  const ta = Math.atan2(tlist[tlist.length - 1][1], tlist[tlist.length - 1][0]);

  for (let i = 0; i < tlist.length; i++) {
    const a = Math.atan2(tlist[i][1], tlist[i][0]);
    const d = Math.sqrt(tlist[i][0] * tlist[i][0] + tlist[i][1] * tlist[i][1]);
    tlist[i][0] = d * Math.cos(a - ta + ang);
    tlist[i][1] = d * Math.sin(a - ta + ang);
  }

  const trlist1 = [];
  const trlist2 = [];
  const span = det;
  const tl = (tlist.length - 1) * span;
  let lx = 0;
  let ly = 0;

  for (let i = 0; i < tl; i++) {
    const lastp = tlist[Math.floor(i / span)];
    const nextp = tlist[Math.ceil(i / span)];
    const p = (i % span) / span;
    const px = lastp[0] * (1 - p) + nextp[0] * p;
    const py = lastp[1] * (1 - p) + nextp[1] * p;

    const angle = Math.atan2(py - ly, px - lx);
    const woff = ((noise.noise(i * 0.3) - 0.5) * wid * hei) / 80;
    const b = p === 0 ? rand() * wid : 0;
    const nw = wid * (((tl - i) / tl) * 0.5 + 0.5);

    trlist1.push([px + Math.cos(angle + Math.PI / 2) * (nw + woff + b), py + Math.sin(angle + Math.PI / 2) * (nw + woff + b)]);
    trlist2.push([px + Math.cos(angle - Math.PI / 2) * (nw - woff + b), py + Math.sin(angle - Math.PI / 2) * (nw - woff + b)]);
    lx = px;
    ly = py;
  }

  return [trlist1, trlist2];
}

export function twig(tx, ty, dep, args = {}) {
  const dir = args.dir !== undefined ? args.dir : 1;
  const sca = args.sca !== undefined ? args.sca : 1;
  const wid = args.wid !== undefined ? args.wid : 1;
  const ang = args.ang !== undefined ? args.ang : 0;

  let canv = "";
  const twlist = [];
  const tl = 10;
  const hs = rand() * 0.5 + 0.5;
  const a0 = (rand() * Math.PI) / 6 * dir + ang;

  for (let i = 0; i < tl; i++) {
    const mx = dir * (-1 / Math.pow(i / tl + 1, 5) + 1) * 50 * sca * hs;
    const my = -i * 5 * sca;
    const a = Math.atan2(my, mx);
    const d = Math.pow(mx * mx + my * my, 0.5);

    const nx = Math.cos(a + a0) * d;
    const ny = Math.sin(a + a0) * d;

    twlist.push([nx + tx, ny + ty]);
    if ((i === Math.floor(tl / 3) || i === Math.floor((tl * 2) / 3)) && dep > 0) {
      canv += twig(nx + tx, ny + ty, dep - 1, {
        ang,
        sca: sca * 0.8,
        wid,
        dir: dir * randChoice([-1, 1]),
      });
    }
    if (i === tl - 1) {
      for (let j = 0; j < 5; j++) {
        const dj = (j - 2.5) * 5;
        canv += blob(
          nx + tx + Math.cos(ang) * dj * wid,
          ny + ty + Math.sin(ang) * dj * wid,
          {
            wid: (6 + 3 * rand()) * wid,
            len: (15 + 12 * rand()) * wid,
            ang: ang / 2 + Math.PI / 2 + Math.PI * 0.2 * (rand() - 0.5),
            col: getInkColor((0.55 + dep * 0.15).toFixed(2)),
          }
        );
      }
    }
  }

  canv += stroke(twlist, {
    wid: 1,
    fun: (x) => Math.cos((x * Math.PI) / 2),
    col: getInkColor(0.5),
  });

  return canv;
}

export function barkify(x, y, trlist) {
  function bark(bx, by, bwid, bang) {
    const len = 10 + 10 * rand();
    const noi = 0.5;
    const reso = 20.0;
    const lalist = [];
    for (let i = 0; i < reso + 1; i++) {
      const p = (i / reso) * 2;
      const xo = len / 2 - Math.abs(p - 1) * len;
      const yo = ((p <= 1 ? Math.pow(Math.sin(p * Math.PI), 0.5) : -Math.pow(Math.sin((p + 1) * Math.PI), 0.5)) * bwid) / 2;
      const a = Math.atan2(yo, xo);
      const l = Math.sqrt(xo * xo + yo * yo);
      lalist.push([l, a]);
    }
    const nslist = [];
    const n0 = rand() * 10;
    for (let i = 0; i < reso + 1; i++) {
      nslist.push(noise.noise(i * 0.05, n0));
    }
    loopNoise(nslist);
    const brklist = [];
    for (let i = 0; i < lalist.length; i++) {
      const ns = nslist[i] * noi + (1 - noi);
      brklist.push([bx + Math.cos(lalist[i][1] + bang) * lalist[i][0] * ns, by + Math.sin(lalist[i][1] + bang) * lalist[i][0] * ns]);
    }
    const fr = rand();
    return stroke(brklist, {
      wid: 0.8,
      noi: 0,
      col: getInkColor(0.4),
      out: 0,
      fun: (t) => Math.sin((t + fr) * Math.PI * 3),
    });
  }

  let canv = "";
  for (let i = 2; i < trlist[0].length - 1; i++) {
    const a0 = Math.atan2(trlist[0][i][1] - trlist[0][i - 1][1], trlist[0][i][0] - trlist[0][i - 1][0]);
    const a1 = Math.atan2(trlist[1][i][1] - trlist[1][i - 1][1], trlist[1][i][0] - trlist[1][i - 1][0]);
    const p = rand();
    const nx = trlist[0][i][0] * (1 - p) + trlist[1][i][0] * p;
    const ny = trlist[0][i][1] * (1 - p) + trlist[1][i][1] * p;
    if (rand() < 0.2) {
      canv += blob(nx + x, ny + y, {
        noi: 1,
        len: 15,
        wid: 6 - Math.abs(p - 0.5) * 10,
        ang: (a0 + a1) / 2,
        col: getInkColor(0.65),
      });
    } else {
      canv += bark(nx + x, ny + y, 5 - Math.abs(p - 0.5) * 10, (a0 + a1) / 2);
    }
  }

  const trflist = trlist[0].concat(trlist[1].slice().reverse());
  const rglist = [[]];
  for (let i = 0; i < trflist.length; i++) {
    if (rand() < 0.5) {
      rglist.push([]);
    } else {
      rglist[rglist.length - 1].push(trflist[i]);
    }
  }

  for (let i = 0; i < rglist.length; i++) {
    const dlist = div(rglist[i], 4);
    for (let j = 0; j < dlist.length; j++) {
      dlist[j][0] += (noise.noise(i, j * 0.1, 1) - 0.5) * (15 + 5 * randGaussian());
      dlist[j][1] += (noise.noise(i, j * 0.1, 2) - 0.5) * (15 + 5 * randGaussian());
    }
    canv += stroke(dlist.map((v) => [v[0] + x, v[1] + y]), {
      wid: 1.5,
      col: getInkColor(0.7),
      out: 0,
    });
  }

  return canv;
}

export const Tree = {
  tree01(x, y, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 50;
    const wid = args.wid !== undefined ? args.wid : 3;
    const col = args.col !== undefined ? args.col : getInkColor(0.85);

    const reso = 10;
    const nslist = [];
    for (let i = 0; i < reso; i++) {
      nslist.push([noise.noise(i * 0.5), noise.noise(i * 0.5, 0.5)]);
    }

    let canv = "";
    const line1 = [];
    const line2 = [];

    for (let i = 0; i < reso; i++) {
      const nx = x;
      const ny = y - (i * hei) / reso;
      if (i >= reso / 4) {
        for (let j = 0; j < (reso - i) / 5; j++) {
          const leafAlpha = (rand() * 0.25 + 0.6).toFixed(2);
          canv += blob(
            nx + (rand() - 0.5) * wid * 1.2 * (reso - i),
            ny + (rand() - 0.5) * wid,
            {
              len: rand() * 20 * (reso - i) * 0.2 + 10,
              wid: rand() * 6 + 3,
              ang: ((rand() - 0.5) * Math.PI) / 6,
              col: getInkColor(leafAlpha),
            }
          );
        }
      }
      line1.push([nx + (nslist[i][0] - 0.5) * wid - wid / 2, ny]);
      line2.push([nx + (nslist[i][1] - 0.5) * wid + wid / 2, ny]);
    }
    canv += poly(line1, { fil: "none", str: col, wid: 1.5 });
    canv += poly(line2, { fil: "none", str: col, wid: 1.5 });
    return canv;
  },

  tree02(x, y, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 16;
    const wid = args.wid !== undefined ? args.wid : 8;
    const clu = args.clu !== undefined ? args.clu : 5;

    let canv = "";
    for (let i = 0; i < clu; i++) {
      const leafAlpha = (rand() * 0.25 + 0.65).toFixed(2);
      canv += blob(
        x + randGaussian() * clu * 4,
        y + randGaussian() * clu * 4,
        {
          ang: Math.PI / 2,
          fun: (t) => (t <= 1 ? Math.pow(Math.sin(t * Math.PI) * t, 0.5) : -Math.pow(Math.sin((t - 2) * Math.PI * (t - 2)), 0.5)),
          wid: rand() * wid * 0.75 + wid * 0.5,
          len: rand() * hei * 0.75 + hei * 0.5,
          col: getInkColor(leafAlpha),
        }
      );
    }
    return canv;
  },

  tree03(x, y, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 50;
    const wid = args.wid !== undefined ? args.wid : 5;
    const ben = args.ben !== undefined ? args.ben : (() => 0);
    const col = args.col !== undefined ? args.col : getInkColor(0.85);

    const reso = 10;
    const nslist = [];
    for (let i = 0; i < reso; i++) {
      nslist.push([noise.noise(i * 0.5), noise.noise(i * 0.5, 0.5)]);
    }

    let canv = "";
    let blobs = "";
    const line1 = [];
    const line2 = [];

    for (let i = 0; i < reso; i++) {
      const nx = x + ben(i / reso) * 100;
      const ny = y - (i * hei) / reso;
      if (i >= reso / 5) {
        for (let j = 0; j < (reso - i) * 2; j++) {
          const shape = (t) => Math.log(50 * t + 1) / 3.95;
          const ox = rand() * wid * 2 * shape((reso - i) / reso);
          const leafAlpha = (rand() * 0.25 + 0.6).toFixed(2);
          blobs += blob(
            nx + ox * randChoice([-1, 1]),
            ny + (rand() - 0.5) * wid * 2,
            {
              len: ox * 2,
              wid: rand() * 6 + 3,
              ang: ((rand() - 0.5) * Math.PI) / 6,
              col: getInkColor(leafAlpha),
            }
          );
        }
      }
      line1.push([nx + (((nslist[i][0] - 0.5) * wid - wid / 2) * (reso - i)) / reso, ny]);
      line2.push([nx + (((nslist[i][1] - 0.5) * wid + wid / 2) * (reso - i)) / reso, ny]);
    }

    const lc = line1.concat(line2.reverse());
    canv += poly(lc, { fil: "var(--bg-primary)", str: col, wid: 1.5 });
    canv += blobs;
    return canv;
  },

  // The majestic sweeping gnarled pine tree with textured bark and branching arms (clipboard-1791245360998.png)
  tree05(x, y, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 160;
    const wid = args.wid !== undefined ? args.wid : 5;
    const col = args.col !== undefined ? args.col : getInkColor(0.85);

    let canv = "";
    let txcanv = "";
    let twcanv = "";

    const trlistRaw = branch({ hei, wid, ang: -Math.PI / 2, ben: 0.1 });
    txcanv += barkify(x, y, trlistRaw);
    const trlist = trlistRaw[0].concat(trlistRaw[1].slice().reverse());
    let trmlist = [];

    for (let i = 0; i < trlist.length; i++) {
      const p = Math.abs(i - trlist.length * 0.5) / (trlist.length * 0.5);
      if (
        (i >= trlist.length * 0.2 &&
          i <= trlist.length * 0.8 &&
          i % 4 === 0 &&
          rand() > p) ||
        i === Math.floor(trlist.length / 2) - 1
      ) {
        const bar = rand() * 0.2;
        const ba = -bar * Math.PI - (1 - bar * 2) * Math.PI * (i > trlist.length / 2 ? 1 : 0);
        const brlist = branch({
          hei: hei * (0.35 * p + rand() * 0.1),
          wid: wid * 0.5,
          ang: ba,
          ben: 0.4,
        });

        brlist[0].splice(0, 1);
        brlist[1].splice(0, 1);

        for (let j = 0; j < brlist[0].length; j++) {
          if (j % 12 === 0 || j === brlist[0].length - 1) {
            twcanv += twig(
              brlist[0][j][0] + trlist[i][0] + x,
              brlist[0][j][1] + trlist[i][1] + y,
              0,
              {
                wid: hei / 300,
                ang: ba > -Math.PI / 2 ? ba : ba + Math.PI,
                sca: (0.3 * hei) / 300,
                dir: ba > -Math.PI / 2 ? 1 : -1,
              }
            );
          }
        }
        brlist[0] = brlist[0].concat(brlist[1].reverse());
        trmlist = trmlist.concat(
          brlist[0].map((v) => [v[0] + trlist[i][0], v[1] + trlist[i][1]])
        );
      } else {
        trmlist.push(trlist[i]);
      }
    }

    canv += poly(trmlist, { xof: x, yof: y, fil: "var(--bg-primary)", str: col, wid: 0 });

    trmlist.splice(0, 1);
    trmlist.splice(trmlist.length - 1, 1);
    canv += stroke(
      trmlist.map((v) => [v[0] + x, v[1] + y]),
      {
        col: getInkColor(0.6),
        wid: 2.2,
        fun: () => Math.sin(1),
        noi: 0.9,
        out: 0,
      }
    );

    canv += txcanv;
    canv += twcanv;
    return canv;
  },
};
