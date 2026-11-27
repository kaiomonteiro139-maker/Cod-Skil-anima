const fs=require("fs");let s=fs.readFileSync("web/toonbase.js","utf8");
const esc=x=>x.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");const rep=(a,b)=>{const re=new RegExp([...a.replace(/\s+/g,"")].map(esc).join("\\s*"));if(!re.test(s))throw new Error("miss: "+a.slice(0,60));s=s.replace(re,()=>b);};
// new expressions
rep(`lick: { eye: ["dot", "dot"], brow: [0, -1], mouth: "lick" },`,
`lick: { eye: ["dot", "dot"], brow: [0, -1], mouth: "lick" },
  sweet: { eye: ["happy", "happy"], brow: [-1, -2], mouth: "smile" },
  creepy: { eye: ["lid", "lid"], brow: [4, -3], mouth: "smileWide" },
  creepy2: { eye: ["small", "small"], brow: [6, -5], mouth: "smileWide" },
  worried: { eye: ["small", "small"], brow: [-4, 3], mouth: "dash" },
  scared: { eye: ["shock", "shock"], brow: [-6, -2], mouth: "wave" },`);
// long hair behind the head
rep(`const hatBehind = (p, o, H, cx, hc, light, thick, ow, side) => {
  if (o.hat !== "bonnet") return;`,
`const hatBehind = (p, o, H, cx, hc, light, thick, ow, side) => {
  if (o.hat === "longhair") {
    const u = H.a / 50, top = hc - H.b * 1.08, bot = hc + H.b * 2.0, w = H.a * 1.12;
    const pts = [];
    for (let i = 0; i <= 24; i++) { const a = Math.PI + (Math.PI * i) / 24; pts.push([cx + w * Math.cos(a), hc + H.b * 1.08 * Math.sin(a)]); }
    pts.push([cx + w * 1.02, hc + H.b * 0.6], [cx + w * 0.98, bot - 10 * u], [cx + w * 0.7, bot], [cx + w * 0.35, bot - 6 * u], [cx, bot + 4 * u],
      [cx - w * 0.35, bot - 6 * u], [cx - w * 0.7, bot], [cx - w * 0.98, bot - 10 * u], [cx - w * 1.02, hc + H.b * 0.6]);
    p.shadedFill(pts, o.hair, mul(o.hair, SH_FELT), light, w);
    p.inkRing(pts, ow * 0.85, thick);
    return;
  }
  if (o.hat !== "bonnet") return;`);
// bangs for long hair reuse "hair"; helmet dome
rep(`} else if (o.hat === "cap" || o.hat === "hair") {
    const cut = crown + (o.hat === "cap" ? 0.3 : 0.42) * HH;`,
`} else if (o.hat === "helmet") {
    const col = o.cap, cut = hc - 0.52 * H.b, k = 1.13;
    const dome = [];
    for (let i = 0; i <= 30; i++) { const a = Math.PI + (Math.PI * i) / 30; dome.push([cx + H.a * k * Math.cos(a), hc - 0.05 * H.b + H.b * k * 1.02 * Math.sin(a)]); }
    dome.push([cx + H.a * k, hc + 0.55 * H.b], [cx + H.a * 0.86, hc + 0.62 * H.b], [cx + H.a * 0.84, cut], [cx - H.a * 0.84, cut], [cx - H.a * 0.86, hc + 0.62 * H.b], [cx - H.a * k, hc + 0.55 * H.b]);
    const D = R(dome);
    p.shadedFill(D, col, mul(col, SH_FELT), light, H.a * k, 0.35);
    p.clip(D, () => p.band(R([[cx - H.a * 1.3, hc - 0.62 * H.b], [cx + H.a * 1.3, hc - 0.62 * H.b]]), "#f2f2f2", 0.09 * HH, 0));
    p.poly(D, null, ow);
    // visor flipped up: dark smoked strip over the brow
    const V = R([[cx - H.a * 0.98, cut - 0.22 * H.b], [cx + H.a * 0.98, cut - 0.22 * H.b], [cx + H.a * 0.92, cut + 0.02 * H.b], [cx - H.a * 0.92, cut + 0.02 * H.b]]);
    p.poly(V, "#2b3442", ow * 0.8);
    p.stroke(R([[cx - H.a * 0.6, cut - 0.14 * H.b], [cx - H.a * 0.1, cut - 0.14 * H.b]]), 2.2 * u, "#8fa3bd");
    return;
  } else if (o.hat === "cap" || o.hat === "hair" || o.hat === "longhair") {
    const cut = crown + (o.hat === "cap" ? 0.3 : 0.42) * HH;`);
rep(`if (o.hat === "hair") { // scalloped`, `if (o.hat === "hair" || o.hat === "longhair") { // scalloped`);
rep(`if (o.hat === "hair") {
      const s = side`, `if (o.hat === "hair" || o.hat === "longhair") {
      const s = side`);
rep(`const brim = !!o.hat && o.hat !== "hair" && o.hat !== "bonnet" && o.hat !== "cap";`,
    `const brim = !!o.hat && o.hat !== "hair" && o.hat !== "bonnet" && o.hat !== "cap" && o.hat !== "longhair" && o.hat !== "helmet";`);
// phone / delivery bag props held in front, and open-palms "empty hands"
rep(`} else if (prop === "icecream") {
      const S = sh(1);`, `} else if (prop === "phone" || prop === "bag") {
      const S = sh(1);
      arms.push({ pts: [S, [tcx + 1.05 * T.a + 4 * u, S[1] + 0.42 * HH], [tcx + 0.35 * T.a, S[1] + (prop === "bag" ? 0.55 : 0.3) * HH]], front: true });
    } else if (prop === "palms") {
      for (const side of [1]) { const S = sh(side); arms.push({ pts: [S, [tcx + side * (1.15 * T.a + 8 * u), S[1] + 0.3 * HH], [tcx + side * (1.3 * T.a + 22 * u), S[1] + 0.22 * HH]], front: false }); }
    } else if (prop === "icecream") {
      const S = sh(1);`);
rep(`arms.push({ pts: prop === "shako" ? hang(-1, 0) : hang(-1, -sw), front: false });`,
`if (prop === "palms") { const S = sh(-1); arms.push({ pts: [S, [tcx - (1.15 * T.a + 8 * u), S[1] + 0.3 * HH], [tcx - (1.3 * T.a + 22 * u), S[1] + 0.22 * HH]], front: false }); }
    else arms.push({ pts: prop === "shako" ? hang(-1, 0) : hang(-1, -sw), front: false });`);
rep(`if (prop === "icecream") {
      p.poly([[hx - 8 * u`, `if (prop === "phone") {
      p.poly(rrect(hx - 11 * u, hy - 34 * u, hx + 11 * u, hy + 4 * u, 3 * u), "#1c1f26", 2 * u);
      p.poly(rrect(hx - 8 * u, hy - 30 * u, hx + 8 * u, hy, 2 * u), "#7fd0ff", 0);
      p.dot(hx, hy, 5.5 * u);
    } else if (prop === "bag") {
      p.poly(rrect(hx - 26 * u, hy - 8 * u, hx + 26 * u, hy + 34 * u, 4 * u), "#c9a36a", 2.4 * u);
      p.stroke([[hx - 26 * u, hy + 4 * u], [hx + 26 * u, hy + 4 * u]], 2 * u);
      p.poly(rrect(hx - 6 * u, hy + 10 * u, hx + 6 * u, hy + 22 * u, 1.5 * u), "#d8333a", 1.5 * u);
      p.dot(hx, hy, 5.5 * u);
    } else if (prop === "icecream") {
      p.poly([[hx - 8 * u`);
rep(`const legW = 5.8 * u, footW = 7.5 * u;`, `const legW = 5.8 * u, footW = 7.5 * u;
  if (o.hat === "longhair") { p.rot = null; hatBehind(p, o, H, 300, hc, light, thick, ow, false, true); }`);
rep(`const hatBehind = (p, o, H, cx, hc, light, thick, ow, side) => {
  if (o.hat === "longhair") {`, `const hatBehind = (p, o, H, cx, hc, light, thick, ow, side, pre) => {
  if (o.hat === "longhair") { if (!pre) return;`);
rep(`p.inkRing(hp, ow, thick);
  hatOn(p, o, hp, H, 300, hc, light, seed, facing, false);`, `p.inkRing(hp, ow, thick);
  if (opts.back) {
    if (o.hat === "longhair") hatBehind(p, o, H, 300, hc, light, thick, ow, false, true);
    else if (o.hat === "helmet") { const hb = blobPts(300, hc - 0.05 * H.b, { ...H, a: H.a * 1.13, b: H.b * 1.1 }); p.shadedFill(hb, o.cap, mul(o.cap, SH_FELT), light, H.a); p.clip(hb, () => p.band([[300 - H.a * 1.3, hc - 0.4 * H.b], [300 + H.a * 1.3, hc - 0.4 * H.b]], "#f2f2f2", 0.09 * 2 * H.b, 0)); p.inkRing(hb, ow, thick); }
    p.rot = null; return;
  }
  hatOn(p, o, hp, H, 300, hc, light, seed, facing, false);`);
// export rrect for scene props
s+="\nexport { rrect, ellPts };\n";
fs.writeFileSync("web/toon.js",s);console.log("patched");
