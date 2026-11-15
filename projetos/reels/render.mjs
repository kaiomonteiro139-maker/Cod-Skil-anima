// node render.mjs <outdir> "<frames spec: 0-99,120,130>" [workers] [w h]
import { chromium } from "playwright"; import http from "http"; import fs from "fs"; import path from "path";
const [outDir, spec, nW = "3", w = "720", h = "1280"] = process.argv.slice(2);
const frames = []; for (const p of spec.split(",")) { const [a, b] = p.split("-").map(Number); for (let f = a; f <= (isNaN(b) ? a : b); f++) frames.push(f); }
fs.mkdirSync(outDir, { recursive: true });
const todo = frames.filter((f) => !(process.env.RESUME && fs.existsSync(`${outDir}/f${String(f).padStart(4, "0")}.jpg`)));
const root = path.resolve("web");
const types = { ".js": "text/javascript", ".html": "text/html" };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" }); r.end(d); }); }).listen(0);
const port = srv.address().port;
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
let next = 0, done = 0; const t0 = Date.now();
async function worker() {
  const pg = await browser.newPage({ viewport: { width: +w, height: +h } });
  pg.on("pageerror", (e) => { console.log("PAGEERR", e.message); process.exitCode = 1; });
  pg.on("console", (m) => { if (m.type() === "error") console.log("CONSOLE", m.text()); });
  await pg.goto(`http://localhost:${port}/index.html?w=${w}&h=${h}&story=${process.env.STORY || "story"}`);
  await pg.waitForFunction("window.ready === true", null, { timeout: 120000 });
  while (next < todo.length) {
    const f = todo[next++];
    const url = await pg.evaluate((f) => window.renderFrame(f), f);
    fs.writeFileSync(`${outDir}/f${String(f).padStart(4, "0")}.jpg`, Buffer.from(url.split(",")[1], "base64"));
    done++; if (done % 30 === 0 || done === todo.length) console.log(`${done}/${todo.length} frames, ${((Date.now() - t0) / done / 1000).toFixed(2)} s/frame`);
  }
}
await Promise.all(Array.from({ length: +nW }, worker));
await browser.close(); srv.close();
