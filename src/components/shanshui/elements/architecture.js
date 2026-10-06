import { rand, normRand, wtrand } from '../core/prng.js';
import { noise } from '../core/noise.js';
import { poly, stroke, div, bezmh } from '../core/geom.js';
import { texture } from './mountains.js';

export function deco(style = 1, args = {}) {
  const pul = args.pul !== undefined ? args.pul : [0, 0];
  const pur = args.pur !== undefined ? args.pur : [0, 100];
  const pdl = args.pdl !== undefined ? args.pdl : [100, 0];
  const pdr = args.pdr !== undefined ? args.pdr : [100, 100];
  const hsp = args.hsp !== undefined ? args.hsp : [1, 3];
  const vsp = args.vsp !== undefined ? args.vsp : [1, 2];

  const plist = [];
  const dl = div([pul, pdl], vsp[1]);
  const dr = div([pur, pdr], vsp[1]);
  const du = div([pul, pur], hsp[1]);
  const dd = div([pdl, pdr], hsp[1]);

  if (style === 1) {
    const mlu = du[hsp[0]];
    const mru = du[du.length - 1 - hsp[0]];
    const mld = dd[hsp[0]];
    const mrd = dd[du.length - 1 - hsp[0]];

    for (let i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
      const mml = div([mlu, mld], vsp[1])[i];
      const mmr = div([mru, mrd], vsp[1])[i];
      const ml = dl[i];
      const mr = dr[i];
      plist.push(div([mml, ml], 5));
      plist.push(div([mmr, mr], 5));
    }
    plist.push(div([mlu, mld], 5));
    plist.push(div([mru, mrd], 5));
  } else if (style === 2) {
    for (let i = hsp[0]; i < du.length - hsp[0]; i += hsp[0]) {
      const mu = du[i];
      const md = dd[i];
      plist.push(div([mu, md], 5));
    }
  }
  return plist;
}

export function pagroof(xoff, yoff, args = {}) {
  const hei = args.hei !== undefined ? args.hei : 20;
  const wid = args.wid !== undefined ? args.wid : 60;
  const per = args.per !== undefined ? args.per : 4;
  const cor = args.cor !== undefined ? args.cor : 10;
  const sid = args.sid !== undefined ? args.sid : 4;
  const wei = args.wei !== undefined ? args.wei : 2;

  const ptlist = [];
  const polist = [[0, -hei]];
  let canv = "";

  for (let i = 0; i < sid; i++) {
    const fx = wid * ((i * 1.0) / (sid - 1) - 0.5);
    const fy = per * (1 - Math.abs((i * 1.0) / (sid - 1) - 0.5) * 2);
    const fxx = (wid + cor) * ((i * 1.0) / (sid - 1) - 0.5);
    if (i > 0) {
      ptlist.push([ptlist[ptlist.length - 1][2], [fxx, fy]]);
    }
    ptlist.push([[0, -hei], [fx * 0.5, (-hei + fy) * 0.5], [fxx, fy]]);
    polist.push([fxx, fy]);
  }

  canv += poly(polist, { xof: xoff, yof: yoff, str: "none", fil: "var(--bg-primary)" });

  for (let i = 0; i < ptlist.length; i++) {
    canv += stroke(
      div(ptlist[i], 5).map((x) => [x[0] + xoff, x[1] + yoff]),
      {
        col: "rgba(var(--ink-rgb),0.55)",
        noi: 0.8,
        wid: wei,
      }
    );
  }

  return canv;
}

export function roof(xoff, yoff, args = {}) {
  const hei = args.hei !== undefined ? args.hei : 20;
  const wid = args.wid !== undefined ? args.wid : 120;
  const rot = args.rot !== undefined ? args.rot : 0.7;
  const per = args.per !== undefined ? args.per : 4;
  const cor = args.cor !== undefined ? args.cor : 5;
  const wei = args.wei !== undefined ? args.wei : 2.5;

  const mid = -wid * 0.5 + wid * rot;
  const quat = (mid + wid * 0.5) * 0.5 - mid;

  const ptlist = [];
  ptlist.push(
    div([
      [-wid * 0.5 + quat, -hei - per / 2],
      [-wid * 0.5 + quat * 0.5, -hei / 2 - per / 4],
      [-wid * 0.5 - cor, 0],
    ], 5)
  );
  ptlist.push(
    div([
      [mid + quat, -hei],
      [(mid + quat + wid * 0.5) / 2, -hei / 2],
      [wid * 0.5 + cor, 0],
    ], 5)
  );
  ptlist.push(
    div([
      [mid + quat, -hei],
      [mid + quat / 2, -hei / 2 + per / 2],
      [mid + cor, per],
    ], 5)
  );
  ptlist.push(div([[-wid * 0.5 - cor, 0], [mid + cor, per]], 5));
  ptlist.push(div([[wid * 0.5 + cor, 0], [mid + cor, per]], 5));
  ptlist.push(
    div([[-wid * 0.5 + quat, -hei - per / 2], [mid + quat, -hei]], 5)
  );

  let canv = "";
  const polist = [
    [-wid * 0.5, 0],
    [-wid * 0.5 + quat, -hei - per / 2],
    [mid + quat, -hei],
    [wid * 0.5, 0],
    [mid, per],
  ];
  canv += poly(polist, { xof: xoff, yof: yoff, str: "none", fil: "var(--bg-primary)" });

  for (let i = 0; i < ptlist.length; i++) {
    canv += stroke(
      ptlist[i].map((x) => [x[0] + xoff, x[1] + yoff]),
      {
        col: "rgba(var(--ink-rgb),0.55)",
        noi: 0.8,
        wid: wei,
      }
    );
  }
  return canv;
}

export const Man = {
  man(xoff, yoff, args = {}) {
    const sca = args.sca !== undefined ? args.sca : 0.5;
    const fli = args.fli !== undefined ? args.fli : true;
    const hat = args.hat !== undefined ? args.hat : null;
    const ang = [
      0,
      -Math.PI / 2,
      normRand(0, 0),
      (Math.PI / 4) * rand(),
      ((Math.PI * 3) / 4) * rand(),
      (Math.PI * 3) / 4,
      -Math.PI / 4,
      (-Math.PI * 3) / 4 - (Math.PI / 4) * rand(),
      -Math.PI / 4,
    ];
    let len = [0, 30, 20, 30, 30, 30, 30, 30, 30].map((v) => v * sca);
    let canv = "";
    const sct = {
      0: { 1: { 2: {}, 5: { 6: {} }, 7: { 8: {} } }, 3: { 4: {} } },
    };

    function gpar(tree, ind) {
      const keys = Object.keys(tree);
      for (let i = 0; i < keys.length; i++) {
        if (keys[i] === String(ind)) {
          return [ind];
        }
        const r = gpar(tree[keys[i]], ind);
        if (r !== false) {
          return [parseFloat(keys[i])].concat(r);
        }
      }
      return false;
    }

    function grot(ind) {
      const par = gpar(sct, ind);
      let rot = 0;
      for (let i = 0; i < par.length; i++) {
        rot += ang[par[i]];
      }
      return rot;
    }

    function gpos(ind) {
      const par = gpar(sct, ind);
      const pos = [0, 0];
      for (let i = 0; i < par.length; i++) {
        const a = grot(par[i]);
        pos[0] += len[par[i]] * Math.cos(a);
        pos[1] += len[par[i]] * Math.sin(a);
      }
      return pos;
    }

    const pts = [];
    for (let i = 0; i < ang.length; i++) {
      pts.push(gpos(i));
    }
    const adjustedY = yoff - pts[4][1];

    const expand = (ptlist, wfun) => {
      const vtx0 = [];
      const vtx1 = [];
      for (let i = 1; i < ptlist.length - 1; i++) {
        const w = wfun(i / ptlist.length);
        const a1 = Math.atan2(ptlist[i][1] - ptlist[i - 1][1], ptlist[i][0] - ptlist[i - 1][0]);
        const a2 = Math.atan2(ptlist[i][1] - ptlist[i + 1][1], ptlist[i][0] - ptlist[i + 1][0]);
        let a = (a1 + a2) / 2;
        if (a < a2) {
          a += Math.PI;
        }
        vtx0.push([ptlist[i][0] + w * Math.cos(a), ptlist[i][1] + w * Math.sin(a)]);
        vtx1.push([ptlist[i][0] - w * Math.cos(a), ptlist[i][1] - w * Math.sin(a)]);
      }
      return [vtx0, vtx1];
    };

    const cloth = (plist, fun) => {
      const tlist = bezmh(plist, 2);
      const [tlist1, tlist2] = expand(tlist, fun);
      let out = "";
      out += poly(tlist1.concat(tlist2.reverse()).map((v) => [(fli ? -1 : 1) * v[0] + xoff, v[1] + adjustedY]), {
        fil: "var(--bg-primary)",
      });
      out += stroke(tlist1.map((v) => [(fli ? -1 : 1) * v[0] + xoff, v[1] + adjustedY]), {
        wid: 1,
        col: "rgba(var(--ink-rgb),0.5)",
      });
      out += stroke(tlist2.map((v) => [(fli ? -1 : 1) * v[0] + xoff, v[1] + adjustedY]), {
        wid: 1,
        col: "rgba(var(--ink-rgb),0.6)",
      });
      return out;
    };

    const fsleeve = (x) => sca * 8 * (Math.sin(0.5 * x * Math.PI) * Math.pow(Math.sin(x * Math.PI), 0.1) + (1 - x) * 0.4);
    const fbody = (x) => sca * 11 * (Math.sin(0.5 * x * Math.PI) * Math.pow(Math.sin(x * Math.PI), 0.1) + (1 - x) * 0.5);
    const fhead = (x) => sca * 7 * Math.pow(Math.max(0, 0.25 - Math.pow(x - 0.5, 2)), 0.3);

    canv += cloth([pts[1], pts[7], pts[8]], fsleeve);
    canv += cloth([pts[1], pts[0], pts[3], pts[4]], fbody);
    canv += cloth([pts[1], pts[5], pts[6]], fsleeve);
    canv += cloth([pts[1], pts[2]], fhead);

    // Traditional conical bamboo hat (Douli)
    if (hat === 'douli') {
      const hx = (fli ? -1 : 1) * pts[2][0] + xoff;
      const hy = pts[2][1] + adjustedY;
      const hw = 18 * sca;
      const hh = 7 * sca;
      const hatPoly = [
        [hx - hw, hy + hh * 0.4],
        [hx, hy - hh],
        [hx + hw, hy + hh * 0.4],
        [hx, hy + hh * 0.15],
      ];
      canv += poly(hatPoly, { fil: "var(--bg-primary)", str: "rgba(var(--ink-rgb),0.8)", wid: 1.2 });
      canv += stroke([
        [hx - hw, hy + hh * 0.4],
        [hx + hw, hy + hh * 0.4],
      ], { col: "rgba(var(--ink-rgb),0.7)", wid: 1 });
    }

    return canv;
  },
};

export const Arch = {
  hut(xoff, yoff, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 40;
    const wid = args.wid !== undefined ? args.wid : 180;
    const tex = args.tex !== undefined ? args.tex : 300;
    const reso = [10, 10];
    const ptlist = [];

    for (let i = 0; i < reso[0]; i++) {
      ptlist.push([]);
      const heir = hei + hei * 0.2 * rand();
      for (let j = 0; j < reso[1]; j++) {
        const nx = wid * (i / (reso[0] - 1) - 0.5) * Math.pow(j / (reso[1] - 1), 0.7);
        const ny = heir * (j / (reso[1] - 1));
        ptlist[ptlist.length - 1].push([nx, ny]);
      }
    }

    let canv = "";
    canv += poly(
      ptlist[0].slice(0, -1).concat(ptlist[ptlist.length - 1].slice(0, -1).reverse()),
      { xof: xoff, yof: yoff, fil: "var(--bg-primary)", str: "none" }
    );
    canv += poly(ptlist[0], {
      xof: xoff,
      yof: yoff,
      fil: "none",
      str: "rgba(var(--ink-rgb),0.35)",
      wid: 2,
    });
    canv += poly(ptlist[ptlist.length - 1], {
      xof: xoff,
      yof: yoff,
      fil: "none",
      str: "rgba(var(--ink-rgb),0.35)",
      wid: 2,
    });

    canv += texture(ptlist, {
      xof: xoff,
      yof: yoff,
      tex,
      wid: 1.2,
      len: 0.25,
      col: () => `rgba(var(--ink-rgb),${(0.3 + rand() * 0.35).toFixed(3)})`,
      dis: () => wtrand((a) => a * a),
    });

    return canv;
  },

  box(xoff, yoff, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 20;
    const wid = args.wid !== undefined ? args.wid : 120;
    const rot = args.rot !== undefined ? args.rot : 0.7;
    const per = args.per !== undefined ? args.per : 4;
    const bot = args.bot !== undefined ? args.bot : true;
    const dec = args.dec !== undefined ? args.dec : (() => []);

    const mid = -wid * 0.5 + wid * rot;
    const bmid = -wid * 0.5 + wid * (1 - rot);

    const ptlist = [];
    ptlist.push(div([[-wid * 0.5, -hei], [-wid * 0.5, 0]], 5));
    ptlist.push(div([[wid * 0.5, -hei], [wid * 0.5, 0]], 5));
    ptlist.push(div([[mid, -hei], [mid, per]], 5));
    ptlist.push(div([[bmid, -hei], [bmid, -per]], 5));

    let canv = "";

    // If bot is true, fill wall; if bot is false, it is an open pavilion
    if (bot) {
      const polist = [
        [-wid * 0.5, -hei],
        [wid * 0.5, -hei],
        [wid * 0.5, 0],
        [mid, per],
        [-wid * 0.5, 0],
      ];
      canv += poly(polist, { xof: xoff, yof: yoff, str: "none", fil: "var(--bg-primary)" });

      const surf = (rot < 0.5 ? 1 : -1);
      const declist = dec({
        pul: [surf * wid * 0.5, -hei],
        pur: [mid, -hei + per],
        pdl: [surf * wid * 0.5, 0],
        pdr: [mid, per],
      });

      for (let i = 0; i < declist.length; i++) {
        canv += stroke(
          declist[i].map((x) => [x[0] + xoff, x[1] + yoff]),
          { col: "rgba(var(--ink-rgb),0.35)", wid: 1 }
        );
      }
    }

    for (let i = 0; i < ptlist.length; i++) {
      canv += stroke(
        ptlist[i].map((x) => [x[0] + xoff, x[1] + yoff]),
        { col: "rgba(var(--ink-rgb),0.55)", wid: 2 }
      );
    }
    return canv;
  },

  rail(xoff, yoff, seed = 0, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 20;
    const wid = args.wid !== undefined ? args.wid : 180;
    const rot = args.rot !== undefined ? args.rot : 0.7;
    const per = args.per !== undefined ? args.per : 4;
    const seg = args.seg !== undefined ? args.seg : 4;
    const wei = args.wei !== undefined ? args.wei : 1;
    const mid = -wid * 0.5 + wid * rot;
    const ptlist = [];

    ptlist.push(div([[-wid * 0.5, 0], [mid, per]], seg));
    ptlist.push(div([[mid, per], [wid * 0.5, 0]], seg));
    ptlist.push(div([[-wid * 0.5, -hei], [mid, -hei + per]], seg));
    ptlist.push(div([[mid, -hei + per], [wid * 0.5, -hei]], seg));

    let canv = "";
    for (let i = 0; i < ptlist.length / 2; i++) {
      for (let j = 0; j < ptlist[i].length; j++) {
        ptlist[i][j][1] += (noise.noise(i, j * 0.5, seed) - 0.5) * hei;
        const ln = div([ptlist[i][j], ptlist[ptlist.length / 2 + i][j]], 2);
        canv += poly(ln, {
          xof: xoff,
          yof: yoff,
          fil: "none",
          str: "rgba(var(--ink-rgb),0.5)",
          wid: 2,
        });
      }
    }

    for (let i = 0; i < ptlist.length; i++) {
      canv += stroke(
        ptlist[i].map((x) => [x[0] + xoff, x[1] + yoff]),
        { col: "rgba(var(--ink-rgb),0.5)", noi: 0.5, wid: wei }
      );
    }
    return canv;
  },

  arch01(xoff, yoff, seed = 0, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 75;
    const wid = args.wid !== undefined ? args.wid : 140;
    const per = args.per !== undefined ? args.per : 4;

    const h0 = hei * 0.45; // Roof height
    const h1 = hei * 0.55; // Wall opening height

    let canv = "";
    // Deck terrace foundation
    canv += poly([
      [-wid * 0.55, 0],
      [wid * 0.55, 0],
      [wid * 0.5, 6],
      [-wid * 0.5, 6],
    ], { xof: xoff, yof: yoff, fil: "var(--bg-primary)", str: "rgba(var(--ink-rgb),0.4)", wid: 1.5 });

    // 1. Back railing
    canv += Arch.rail(xoff, yoff, seed, { hei: 9, wid, per: per * 2, seg: 4, tra: true, fro: false });

    // 2. Open timber pillar posts (no opaque wall!)
    canv += Arch.box(xoff, yoff, { hei: h1, wid: (wid * 2) / 3, per, bot: false });

    // 3. Two scholars sitting on the deck with plenty of headroom
    canv += Man.man(xoff - wid * 0.22, yoff, { fli: false, sca: 0.28 });
    canv += Man.man(xoff + wid * 0.22, yoff, { fli: true, sca: 0.28 });

    // 4. Front railing
    canv += Arch.rail(xoff, yoff, seed, { hei: 9, wid, per: per * 2, seg: 4, tra: false, fro: true });

    // 5. Thatched roof placed ON TOP of everything at yoff - hei (eaves rest on top of pillars at yoff - h1)
    canv += Arch.hut(xoff, yoff - hei, { hei: h0, wid, tex: 320 });

    return canv;
  },

  // Multi-tier traditional Chinese Pagoda (as in classical landscape scrolls)
  arch03(xoff, yoff, seed = 0, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 16;
    const wid = args.wid !== undefined ? args.wid : 40;
    const rot = args.rot !== undefined ? args.rot : 0.4;
    const per = args.per !== undefined ? args.per : 4;
    const sto = args.sto !== undefined ? args.sto : 4;

    let canv = "";
    let hoff = 0;

    // Solid foundation terrace embedded into mountain
    canv += poly([
      [-wid * 0.55, 0],
      [wid * 0.55, 0],
      [wid * 0.5, 4],
      [-wid * 0.5, 4],
    ], { xof: xoff, yof: yoff, fil: "var(--bg-primary)", str: "rgba(var(--ink-rgb),0.55)", wid: 1.5 });

    for (let i = 0; i < sto; i++) {
      const curWid = wid * Math.pow(0.86, i);
      const curHei = hei;

      canv += Arch.box(xoff, yoff - hoff, {
        hei: curHei,
        wid: curWid,
        rot,
        per: per / 2,
        dec: (a) => deco(1, Object.assign({}, a, { hsp: [1, 4], vsp: [1, 2] })),
      });

      canv += Arch.rail(xoff, yoff - hoff, i * 0.2 + seed, {
        seg: 4,
        wid: curWid * 1.08,
        hei: curHei / 2.5,
        per: per / 2,
        rot,
        wei: 0.6,
      });

      canv += pagroof(xoff, yoff - hoff - curHei, {
        hei: curHei * 1.3,
        wid: curWid * 1.25,
        rot,
        wei: 1.5,
        per,
        cor: 8,
      });

      hoff += curHei * 1.65;
    }

    // Bronze spire at top of pagoda
    const spireX = xoff;
    const spireY = yoff - hoff;
    canv += `<line x1="${spireX}" y1="${spireY}" x2="${spireX}" y2="${spireY - 18}" stroke="rgba(var(--ink-rgb),0.7)" stroke-width="2" />`;
    canv += `<circle cx="${spireX}" cy="${spireY - 18}" r="2.5" fill="rgba(var(--ink-rgb),0.8)" />`;

    return canv;
  },

  // Two-story traditional mountain villa / pavilion with hip-and-gable roof
  arch04(xoff, yoff, seed = 0, args = {}) {
    const hei = args.hei !== undefined ? args.hei : 20;
    const wid = args.wid !== undefined ? args.wid : 56;
    const rot = args.rot !== undefined ? args.rot : 0.55;
    const per = args.per !== undefined ? args.per : 4;
    const sto = args.sto !== undefined ? args.sto : 2;

    let canv = "";
    let hoff = 0;

    // Solid foundation terrace
    canv += poly([
      [-wid * 0.65, 0],
      [wid * 0.65, 0],
      [wid * 0.6, 6],
      [-wid * 0.6, 6],
    ], { xof: xoff, yof: yoff, fil: "var(--bg-primary)", str: "rgba(var(--ink-rgb),0.5)", wid: 1.5 });

    for (let i = 0; i < sto; i++) {
      const curWid = wid * Math.pow(0.88, i);
      const curHei = hei;

      canv += Arch.box(xoff, yoff - hoff, {
        hei: curHei,
        wid: curWid,
        rot,
        per: per / 2,
        dec: (a) => deco(1, Object.assign({}, a, { hsp: [1, 3], vsp: [1, 2] })),
      });

      canv += Arch.rail(xoff, yoff - hoff, i * 0.2 + seed, {
        seg: 3,
        wid: curWid * 1.12,
        hei: curHei / 3,
        per: per / 2,
        rot,
        wei: 0.6,
      });

      canv += roof(xoff, yoff - hoff - curHei, {
        hei: curHei * 1.1,
        wid: curWid * 1.3,
        rot,
        wei: 1.8,
        per,
        cor: 8,
      });

      hoff += curHei * 1.7;
    }

    return canv;
  },

  boat01(xoff, yoff, args = {}) {
    const len = args.len !== undefined ? args.len : 120;
    const sca = args.sca !== undefined ? args.sca : 1;
    const fli = args.fli !== undefined ? args.fli : false;
    let canv = "";

    const dir = fli ? -1 : 1;
    canv += Man.man(xoff + 20 * sca * dir, yoff, {
      sca: 0.5 * sca,
      fli: !fli,
      hat: rand() > 0.35 ? 'douli' : null,
    });

    // Fishing rod extending over the water & slender fishing line
    const rodStartX = xoff + 15 * sca * dir;
    const rodStartY = yoff - 8 * sca;
    const rodEndX = xoff - 35 * sca * dir;
    const rodEndY = yoff - 22 * sca;
    canv += `<line x1="${rodStartX.toFixed(1)}" y1="${rodStartY.toFixed(1)}" x2="${rodEndX.toFixed(1)}" y2="${rodEndY.toFixed(1)}" stroke="rgba(var(--ink-rgb),0.85)" stroke-width="${1.1 * sca}" />`;
    canv += `<line x1="${rodEndX.toFixed(1)}" y1="${rodEndY.toFixed(1)}" x2="${(rodEndX - 4 * dir).toFixed(1)}" y2="${(yoff + 6 * sca).toFixed(1)}" stroke="rgba(var(--ink-rgb),0.6)" stroke-width="${0.6 * sca}" />`;

    const plist1 = [];
    const plist2 = [];
    const fun1 = (x) => Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * sca;
    const fun2 = (x) => Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * sca;

    for (let i = 0; i < len * sca; i += 5 * sca) {
      plist1.push([i * dir, fun1(i / len)]);
      plist2.push([i * dir, fun2(i / len)]);
    }
    const plist = plist1.concat(plist2.reverse());
    canv += poly(plist, { xof: xoff, yof: yoff, fil: "var(--bg-primary)" });
    canv += stroke(plist.map((v) => [xoff + v[0], yoff + v[1]]), {
      wid: 1,
      col: "rgba(var(--ink-rgb),0.5)",
    });

    return canv;
  },
};
