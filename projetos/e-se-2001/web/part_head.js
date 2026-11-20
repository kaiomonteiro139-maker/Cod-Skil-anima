// "A Última Corrida" (Parte 1): toon world + canvas cards, rendered frame by frame.
import * as THREE from "./three.module.js";
import * as P from "./paint.js";
import * as T from "./toon.js";
import { SHOTS, shotAt, FPS, TOTAL } from "./story.js";

const q = new URLSearchParams(location.search);
const W = +(q.get("w") || 720), H = +(q.get("h") || 1280);
const glc = document.createElement("canvas"); glc.width = W; glc.height = H;
const out = document.getElementById("out"); out.width = W; out.height = H;
const og = out.getContext("2d");
const renderer = new THREE.WebGLRenderer({ canvas: glc, antialias: false, preserveDrawingBuffer: true });
renderer.setSize(W, H, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(40, W / H, 0.05, 400);

// ---------- toon materials ----------
const gradMap = (() => {
  const d = new Uint8Array([70, 70, 70, 255, 150, 150, 150, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(d, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();
const toon = (color, map, extra = {}) => new THREE.MeshToonMaterial({ color, map: map || null, gradientMap: gradMap, ...extra });
const glow = (color, opacity = 1) => new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, fog: false });

const TEXEL = 2.2; // metres per texture repeat
/** box with constant texel density (UVs scaled per face) */
function tbox(w, h, d, mat, x = 0, y = 0, z = 0, parent = scene, density = TEXEL) {
  const g = new THREE.BoxGeometry(w, h, d);
  const uv = g.attributes.uv, dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
    const i = f * 4 + k; uv.setXY(i, uv.getX(i) * dims[f][0] / density, uv.getY(i) * dims[f][1] / density);
  }
  const m = new THREE.Mesh(g, mat); m.position.set(x, y + h / 2, z); parent.add(m); return m;
}
const add = (geo, mat, x = 0, y = 0, z = 0, parent = scene) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); parent.add(m); return m; };
function plane(w, h, mat, x, y, z, rx = 0, ry = 0, parent = scene, density = TEXEL) {
  const g = new THREE.PlaneGeometry(w, h);
  const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / density, uv.getY(i) * h / density);
  const m = new THREE.Mesh(g, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); parent.add(m); return m;
}

// ---------- textures ----------
const TX = {
  asphalt: P.asphalt(), dirt: P.dirt(), line: P.roadLine(),
  plasterA: P.plaster("#8c8a7a", { damp: true, brick: true, cracks: 5 }), plasterB: P.plaster("#7a8a86", { damp: true, cracks: 4 }),
  plasterC: P.plaster("#9a7f6a", { damp: true, brick: true }), plasterLit: P.plaster("#c9b48f", { cracks: 2 }),
  plasterCity: P.plaster("#b9a98a", { cracks: 1 }),
  planks: P.planks("#6b5236", { rot: true }), plankV: P.planks("#5b4430", { vertical: true, n: 5 }), door: P.planks("#5e2c22", { vertical: true, n: 4 }),
  roof: P.roofTiles("#8a4a36"), floor: P.tiles("#6e5a46", "#57483a"),
  wall: P.wallpaper("#6c7a5a", "#5a6649"), ceiling: P.plaster("#4a4238", { cracks: 2 }), wood: P.planks("#7a5232", { n: 4 }),
};

