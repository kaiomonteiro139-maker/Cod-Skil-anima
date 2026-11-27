import { chromium } from "playwright"; import http from "http"; import fs from "fs"; import path from "path";
const [outDir, variants, w = "1920", h = "1080"] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const root = path.resolve("web"); const types = { ".js": "text/javascript", ".html": "text/html" };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" }); r.end(d); }); }).listen(0);
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const pg = await browser.newPage({ viewport: { width: +w, height: +h } });
pg.on("pageerror", (e) => console.log("PAGEERR", e.message));
await pg.goto(`http://localhost:${srv.address().port}/index.html?w=${w}&h=${h}`);
await pg.waitForFunction("window.ready === true", null, { timeout: 120000 });
for (const v of variants.split(",")) {
  const url = await pg.evaluate(async (v) => { globalThis.THUMBV = +v; await window.renderFrame(60000); return await window.renderFrame(60000); }, v);
  fs.writeFileSync(`${outDir}/v${v}.jpg`, Buffer.from(url.split(",")[1], "base64"));
}
await browser.close(); srv.close();
