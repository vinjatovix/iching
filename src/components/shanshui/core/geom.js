import { rand, mapval } from './prng.js';
import { noise } from './noise.js';

export function loopNoise(nslist) {
  const dif = nslist[nslist.length - 1] - nslist[0];
  const bds = [100, -100];
  for (let i = 0; i < nslist.length; i++) {
    nslist[i] += (dif * (nslist.length - 1 - i)) / (nslist.length - 1);
    if (nslist[i] < bds[0]) bds[0] = nslist[i];
    if (nslist[i] > bds[1]) bds[1] = nslist[i];
  }
  for (let i = 0; i < nslist.length; i++) {
    nslist[i] = mapval(nslist[i], bds[0], bds[1], 0, 1);
  }
}

export function midPt(...args) {
  const plist = args.length === 1 ? args[0] : args;
  return plist.reduce(
    (acc, v) => [v[0] / plist.length + acc[0], v[1] / plist.length + acc[1]],
    [0, 0]
  );
}

export function bezmh(P, w = 1) {
  let pts = P;
  if (pts.length === 2) {
    pts = [pts[0], midPt(pts[0], pts[1]), pts[1]];
  }
  const plist = [];
  for (let j = 0; j < pts.length - 2; j++) {
    const p0 = j === 0 ? pts[j] : midPt(pts[j], pts[j + 1]);
    const p1 = pts[j + 1];
    const p2 = j === pts.length - 3 ? pts[j + 2] : midPt(pts[j + 1], pts[j + 2]);
    const pl = 20;
    for (let i = 0; i < pl + (j === pts.length - 3 ? 1 : 0); i++) {
      const t = i / pl;
      const u = Math.pow(1 - t, 2) + 2 * t * (1 - t) * w + t * t;
      plist.push([
        (Math.pow(1 - t, 2) * p0[0] + 2 * t * (1 - t) * p1[0] * w + t * t * p2[0]) / u,
        (Math.pow(1 - t, 2) * p0[1] + 2 * t * (1 - t) * p1[1] * w + t * t * p2[1]) / u,
      ]);
    }
  }
  return plist;
}

export function poly(plist, args = {}) {
  const xof = args.xof !== undefined ? args.xof : 0;
  const yof = args.yof !== undefined ? args.yof : 0;
  const fil = args.fil !== undefined ? args.fil : "rgba(0,0,0,0)";
  const str = args.str !== undefined ? args.str : fil;
  const wid = args.wid !== undefined ? args.wid : 0;

  const isFilled = fil !== "none" && fil !== "rgba(0,0,0,0)";
  const tag = isFilled ? "polygon" : "polyline";

  let canv = `<${tag} points='`;
  for (let i = 0; i < plist.length; i++) {
    canv += ` ${(plist[i][0] + xof).toFixed(1)},${(plist[i][1] + yof).toFixed(1)}`;
  }
  canv += `' style='fill:${fil};stroke:${str};stroke-width:${wid}'/>`;
  return canv;
}

export function stroke(ptlist, args = {}) {
  const xof = args.xof !== undefined ? args.xof : 0;
  const yof = args.yof !== undefined ? args.yof : 0;
  const wid = args.wid !== undefined ? args.wid : 2;
  const col = args.col !== undefined ? args.col : "rgba(var(--ink-rgb),0.9)";
  const noi = args.noi !== undefined ? args.noi : 0.5;
  const out = args.out !== undefined ? args.out : 1;
  const fun = args.fun !== undefined ? args.fun : ((x) => Math.sin(x * Math.PI));

  if (!ptlist || ptlist.length === 0) {
    return "";
  }
  const vtxlist0 = [];
  const vtxlist1 = [];
  const n0 = rand() * 10;

  for (let i = 1; i < ptlist.length - 1; i++) {
    const w = wid * fun(i / ptlist.length) * (1 - noi + noi * noise.noise(i * 0.5, n0));
    const a1 = Math.atan2(ptlist[i][1] - ptlist[i - 1][1], ptlist[i][0] - ptlist[i - 1][0]);
    const a2 = Math.atan2(ptlist[i][1] - ptlist[i + 1][1], ptlist[i][0] - ptlist[i + 1][0]);
    let a = (a1 + a2) / 2;
    if (a < a2) {
      a += Math.PI;
    }
    vtxlist0.push([ptlist[i][0] + w * Math.cos(a), ptlist[i][1] + w * Math.sin(a)]);
    vtxlist1.push([ptlist[i][0] - w * Math.cos(a), ptlist[i][1] - w * Math.sin(a)]);
  }

  const vtxlist = [ptlist[0]]
    .concat(vtxlist0.concat(vtxlist1.concat([ptlist[ptlist.length - 1]]).reverse()))
    .concat([ptlist[0]]);

  return poly(
    vtxlist.map((x) => [x[0] + xof, x[1] + yof]),
    { fil: col, str: col, wid: out }
  );
}

export function blob(x, y, args = {}) {
  const len = args.len !== undefined ? args.len : 20;
  const wid = args.wid !== undefined ? args.wid : 5;
  const ang = args.ang !== undefined ? args.ang : 0;
  const col = args.col !== undefined ? args.col : "rgba(var(--ink-rgb),0.9)";
  const noi = args.noi !== undefined ? args.noi : 0.5;
  const ret = args.ret !== undefined ? args.ret : 0;
  const fun = args.fun !== undefined ? args.fun : ((p) =>
    p <= 1 ? Math.pow(Math.sin(p * Math.PI), 0.5) : -Math.pow(Math.sin((p + 1) * Math.PI), 0.5)
  );

  const reso = 20.0;
  const lalist = [];
  for (let i = 0; i < reso + 1; i++) {
    const p = (i / reso) * 2;
    const xo = len / 2 - Math.abs(p - 1) * len;
    const yo = (fun(p) * wid) / 2;
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
  const plist = [];
  for (let i = 0; i < lalist.length; i++) {
    const ns = nslist[i] * noi + (1 - noi);
    const nx = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
    const ny = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
    plist.push([nx, ny]);
  }

  if (ret === 0) {
    return poly(plist, { fil: col, str: col, wid: 0 });
  }
  return plist;
}

export function div(plist, reso) {
  const tl = (plist.length - 1) * reso;
  const rlist = [];

  for (let i = 0; i < tl; i++) {
    const lastp = plist[Math.floor(i / reso)];
    const nextp = plist[Math.ceil(i / reso)];
    const p = (i % reso) / reso;
    const nx = lastp[0] * (1 - p) + nextp[0] * p;
    const ny = lastp[1] * (1 - p) + nextp[1] * p;
    rlist.push([nx, ny]);
  }

  if (plist.length > 0) {
    rlist.push(plist[plist.length - 1]);
  }
  return rlist;
}
