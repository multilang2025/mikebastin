#!/usr/bin/env node
/**
 * Builds the world and Europe variants of the two Spain-map illustrations
 * (owner, 30 Sep 2026: "in EN and FR I don't want to limit myself to Spain,
 * FR should feature Europe, EN the world").
 *
 * It keeps every element, class and animation of convergence.svg.html and
 * globe.svg.html and swaps only the geometry: the land path (in three
 * places), the pin, and for the convergence map the origin cities, their
 * arcs and the hub. Valencia stays the hub.
 *
 * Needs d3-geo, topojson-client and world-atlas, which are not dependencies
 * of the site: install them in a scratch directory and point NODE_PATH at
 * its node_modules.
 *
 *   NODE_PATH=/path/to/scratch/node_modules node geo/make-variants.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const d3 = require("d3-geo");
const topo = require("topojson-client");
const simp = require("topojson-simplify");
const load = (n) => JSON.parse(readFileSync(require.resolve(`world-atlas/land-${n}.json`), "utf8"));
const atlas = load("50m");
const atlas110 = load("110m");

const DIR = join(dirname(fileURLToPath(import.meta.url)), "..");
const VALENCIA = [-0.38, 39.47];
const r1 = (n) => Math.round(n * 10) / 10;

/**
 * The land as one path, simplified by `min` (square degrees of triangle
 * area) so the three copies in one SVG stay small, without Antarctica: its
 * coast is the longest line on the map and is never in frame.
 */
function pathFor(projection, data, min) {
  const simple = simp.simplify(simp.presimplify(JSON.parse(JSON.stringify(data))), min);
  const fc = topo.feature(simple, simple.objects.land);
  const polys = [];
  for (const f of fc.features ?? [fc]) {
    const g = f.geometry ?? f;
    (g.type === "MultiPolygon" ? g.coordinates : [g.coordinates]).forEach((c) => polys.push(c));
  }
  const land = { type: "MultiPolygon", coordinates: polys.filter((poly) => Math.max(...poly[0].map((pt) => pt[1])) > -60) };
  return d3.geoPath(projection).digits(1)(land);
}

/** An arc like the originals: a quadratic curve bowed to one side. */
function arc([x1, y1], [x2, y2], bow = 0.28) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  let nx = -dy / len, ny = dx / len;
  if (ny > 0) { nx = -nx; ny = -ny; } // bow upward
  return `M${r1(x1)} ${r1(y1)} Q${r1(mx + nx * len * bow)} ${r1(my + ny * len * bow)} ${r1(x2)} ${r1(y2)}`;
}

const worldProj = () => {
  const land = topo.feature(atlas110, atlas110.objects.land);
  // Fit to the land in frame (no Antarctica), not the whole sphere outline.
  const polys = land.features[0].geometry.coordinates.filter((p) => Math.max(...p[0].map((pt) => pt[1])) > -60);
  return d3.geoNaturalEarth1().fitExtent([[36, 110], [564, 490]], { type: "MultiPolygon", coordinates: polys });
};
const europeProj = () =>
  d3.geoConicConformal().rotate([-12, 0]).center([0, 50]).parallels([38, 62]).scale(720).translate([300, 300]).clipExtent([[20, 20], [580, 580]]);

const CONV = {
  world: {
    proj: worldProj(),
    data: atlas110,
    origins: [[-95.4, 29.8], [-69.9, 18.5], [-0.1, 51.5], [55.3, 25.2], [103.8, 1.35]],
  },
  europe: {
    proj: europeProj(),
    data: atlas,
    origins: [[2.35, 48.85], [4.35, 50.85], [4.9, 52.37], [13.4, 52.5], [8.54, 47.37], [-0.12, 51.5]],
  },
};

function convergence(kind) {
  const { proj, data, origins } = CONV[kind];
  let svg = readFileSync(join(DIR, "convergence.svg.html"), "utf8");
  const d0 = svg.match(/<path d="(M213\.0[^"]+)"/)[1];
  const d = pathFor(proj, data, kind === "world" ? 0.6 : 0.05);
  svg = svg.split(d0).join(d);
  svg = svg.replace('<g transform="translate(-61.93 -26.08) scale(1.1)">', '<g clip-path="url(#art-conv-disc)">');
  svg = svg.replace('<rect x="180" y="195" width="274" height="213"', '<rect x="0" y="0" width="600" height="600"');
  svg = svg.replace("</defs>", '<clipPath id="art-conv-disc"><circle cx="300" cy="300" r="282"></circle></clipPath></defs>');
  const hub = proj(VALENCIA);
  svg = svg.split("translate(330 318)").join(`translate(${r1(hub[0])} ${r1(hub[1])})`);
  const pts = origins.map((c) => proj(c));
  const arcGroup = pts
    .map((p, i) => {
      const a = arc(p, hub);
      const cls = (c) => `class="HomeConvergence_${c}"`;
      return `<g style="--i:${i}"><path d="${a}" pathLength="1" ${cls("arc__Exv_K")}></path><path d="${a}" pathLength="1" class="HomeConvergence_spark__hJcWn HomeConvergence_tailLong__bBO4Z"></path><path d="${a}" pathLength="1" class="HomeConvergence_spark__hJcWn HomeConvergence_tailShort__wDR7b"></path><path d="${a}" pathLength="1" class="HomeConvergence_spark__hJcWn HomeConvergence_head__Isbpa"></path></g>`;
    })
    .join("");
  const originGroup = pts
    .map(
      (p, i) =>
        `<g class="HomeConvergence_origin__1QdCe" style="--i:${i}"><circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="10" class="HomeConvergence_halo__S02aF"></circle><circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="10" class="HomeConvergence_haloPulse__rOlGA"></circle><circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="4" class="HomeConvergence_core__Hsfj_"></circle></g>`
    )
    .join("");
  const a = svg.indexOf('<g fill="none" stroke-linecap="round">');
  const b = svg.indexOf('<g transform="translate(', a);
  svg = svg.slice(0, a) + `<g fill="none" stroke-linecap="round">${arcGroup}</g>` + originGroup + svg.slice(b);
  writeFileSync(join(DIR, `convergence-${kind}.svg.html`), svg);
  console.log(kind, "convergence", (svg.length / 1024).toFixed(0), "KB", "hub", hub.map(r1), "origins", pts.map((p) => p.map(r1).join(",")).join(" | "));
}

const GLOBE = {
  world: d3.geoOrthographic().rotate([18, -22]).scale(290).translate([300, 300]).clipAngle(90),
  europe: d3.geoOrthographic().rotate([-10, -47]).scale(1020).translate([300, 300]).clipAngle(90).clipExtent([[0, 0], [600, 600]]),
};

function globe(kind) {
  const proj = GLOBE[kind];
  const data = kind === "world" ? atlas110 : atlas;
  let svg = readFileSync(join(DIR, "globe.svg.html"), "utf8");
  const d0 = svg.match(/<path d="(M213\.0[^"]+)"/)[1];
  svg = svg.split(d0).join(pathFor(proj, data, kind === "world" ? 0.6 : 0.05));
  svg = svg.replace('<rect x="170" y="180" width="300" height="240"', '<rect x="0" y="0" width="600" height="600"');
  svg = svg.replace("</defs>", '<clipPath id="cg-disc"><circle cx="300" cy="300" r="290"></circle></clipPath></defs>');
  svg = svg.replace("<g><path d=", '<g clip-path="url(#cg-disc)"><path d=');
  const p = proj(VALENCIA);
  svg = svg.split('cx="356.3" cy="312.8"').join(`cx="${r1(p[0])}" cy="${r1(p[1])}"`);
  writeFileSync(join(DIR, `globe-${kind}.svg.html`), svg);
  console.log(kind, "globe", (svg.length / 1024).toFixed(0), "KB", "pin", p.map(r1));
}

for (const k of ["world", "europe"]) { convergence(k); globe(k); }
