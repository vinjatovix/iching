/**
 * Shan-Shui Landscape Generator
 * Based on the procedural algorithm by Lingdong Huang (c) 2018 (MIT License).
 * Licensed under the MIT License. See src/components/shanshui/LICENSE for details.
 */
import { prng, normRand } from './core/prng.js';
import { noise } from './core/noise.js';
import { Mount, getFlatMountSurfaceY, getMountainSurfaceY } from './elements/mountains.js';
import { Tree } from './elements/trees.js';
import { Arch } from './elements/architecture.js';
import { water } from './elements/water.js';
import { generateStars } from './elements/stars.js';
import { generateMoon } from './elements/moon.js';
import { generateClouds } from './elements/clouds.js';

export { prng, noise, Mount, Tree, Arch, water, generateStars, generateMoon, generateClouds };

export function generateShanShuiScene(seed = "108") {
  prng.seed(seed);
  noise.reset();

  let canv = "";

  // 1. Gradients for the soft atmospheric mist on distant mountains
  canv += `<defs>
    <linearGradient id="shanshui-dist-mist-far" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(var(--ink-rgb),0.17)" />
      <stop offset="65%" stop-color="rgba(var(--ink-rgb),0.07)" />
      <stop offset="100%" stop-color="rgba(var(--ink-rgb),0.01)" />
    </linearGradient>
    <linearGradient id="shanshui-dist-mist-near" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(var(--ink-rgb),0.25)" />
      <stop offset="60%" stop-color="rgba(var(--ink-rgb),0.11)" />
      <stop offset="100%" stop-color="rgba(var(--ink-rgb),0.02)" />
    </linearGradient>
  </defs>`;

  // 2. Nocturnal celestial elements (rendered in upper sky, visible in dark mode)
  canv += generateMoon(380, 88, 28);
  canv += generateStars(55, 1600, 150);

  // 3. Floating Shan-Shui clouds (placed over the moon to allow subtle nocturnal veiling)
  canv += generateClouds();

  // 4. Two Overlapping Distant Mountain Ranges with atmospheric mist fading at base
  canv += Mount.distMount(-80, 235, 15, { hei: 135, len: 1750, gradId: "shanshui-dist-mist-far", strokeAlpha: 0.20 });
  canv += Mount.distMount(40, 260, 38, { hei: 110, len: 1650, gradId: "shanshui-dist-mist-near", strokeAlpha: 0.28 });

  // 4. Upper Left Island / Mountain:
  const leftMountX = 180 + normRand(-20, 20);
  canv += Mount.mountain(leftMountX, 390, 55, { hei: 150, wid: 340, tex: 90 });

  // 2-story traditional villa near the shoreline by the water (opaque walls/roofs)
  const leftVillaX = leftMountX + 105 + normRand(-10, 10);
  const leftVillaY = 392;
  canv += Arch.arch04(leftVillaX, leftVillaY, 8, { sto: 2, wid: 48, hei: 15 });
  // Pine trees in front of the villa so it is partially nestled behind the trees
  canv += Tree.tree01(leftVillaX - 16, leftVillaY + 2, { hei: 55, wid: 3.5 });
  canv += Tree.tree01(leftVillaX + 18, leftVillaY + 4, { hei: 60, wid: 3.8 });

  // 5. Right Mountains & Architecture:
  // Layer 1: High majestic back mountain peak (restored!)
  const rightPeakX = 1380 + normRand(-20, 20);
  canv += Mount.mountain(rightPeakX, 370, 42, { hei: 340, wid: 500, tex: 160 });

  // Pagoda: positioned at mid-height behind the foreground mountain fold
  const rightForeX = 1180 + normRand(-20, 20);
  const pagodaX = rightForeX + 80 + normRand(-8, 8);
  const foreCrestAtPagoda = getMountainSurfaceY(pagodaX, rightForeX, 510, 77, 460, 260);
  const pagodaY = foreCrestAtPagoda + 24;
  canv += Arch.arch03(pagodaX, pagodaY, 2, { sto: 4, wid: 40, hei: 14 });

  // Layer 2: Foreground mountain island (naturally occludes the base of the pagoda)
  canv += Mount.mountain(rightForeX, 510, 77, { hei: 260, wid: 460, tex: 130 });

  // Sweeping pine tree (Tree.tree05) anchored firmly to the foreground mountain slope
  const treeX = rightForeX + 115 + normRand(-10, 10);
  const treeY = getMountainSurfaceY(treeX, rightForeX, 510, 77, 460, 260);
  canv += Tree.tree05(treeX, treeY, { hei: 105, wid: 4.5 });

  // 6. Open Lake & Fishing Boat (freely floating with bamboo fishing rod)
  const boatX = 420 + normRand(-25, 25);
  const boatY = 440 + normRand(-10, 10);
  canv += water(boatX - 50, boatY + 15, 12, { len: 450, clu: 2 });
  canv += water(520, 530, 24, { len: 450, clu: 2 });
  canv += Arch.boat01(boatX, boatY, { sca: 0.55, fli: true });

  // 7. Foreground Shoreline Spit on the bottom-left (with seed-based horizontal displacement)
  const spitX = 160 + normRand(-25, 25);
  canv += Mount.flatMount(spitX, 680, 31, { wid: 600, hei: 75 });

  // Dynamically sample the exact island elevation at any x coordinate (ZERO floating!)
  const groundY = (x) => getFlatMountSurfaceY(x, spitX, 680, 31, 600, 75);

  // Trees clustered on the left bank (drawn first, grounded on surface)
  const tree1X = spitX - 120 + normRand(-10, 10);
  const tree2X = spitX - 85 + normRand(-10, 10);
  const tree3X = spitX - 50 + normRand(-8, 8);
  canv += Tree.tree01(tree1X, groundY(tree1X), { hei: 75, wid: 4 });
  canv += Tree.tree01(tree2X, groundY(tree2X), { hei: 90, wid: 4.5 });
  canv += Tree.tree02(tree3X, groundY(tree3X), { hei: 16, wid: 8, clu: 3 });

  // Thatched scholar pavilion (roof placed on top of pillars, ample headroom for two scholars having tea)
  const pavX = spitX + 55 + normRand(-15, 15);
  canv += Arch.arch01(pavX, groundY(pavX), 5, { hei: 75, wid: 135 });

  // Iconic gnarled pine on the shoreline rock
  const pineX = spitX + 175 + normRand(-10, 10);
  canv += Tree.tree05(pineX, groundY(pineX), { hei: 105, wid: 4.2 });

  // River boulders along the shoreline (anchored to the ground surface)
  const r1X = spitX + 125 + normRand(-10, 10);
  const r2X = spitX + 225 + normRand(-10, 10);
  canv += Mount.rock(r1X, groundY(r1X), 12, { wid: 36, hei: 26 });
  canv += Mount.rock(r2X, groundY(r2X), 15, { wid: 28, hei: 22 });

  return canv;
}
