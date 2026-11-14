import { chromium } from "playwright"; import http from "http"; import fs from "fs"; import path from "path";
const [outDir, frame, thumbJSON] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const root = path.resolve("web"); const types = { ".js": "text/javascript", ".html": "text/html" };
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "Content-Type": types[path.extname(f)] || "application/octet-stream" }); r.end(d); }); }).listen(0);
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const pg = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("pageerror", (e) => console.log("PAGEERR", e.message));
await pg.goto(`http://localhost:${srv.address().port}/index.html?w=1080&h=1920`);
await pg.waitForFunction("window.ready === true", null, { timeout: 120000 });
const variants = JSON.parse(thumbJSON);
for (let i = 0; i < variants.length; i++) {
  const url = await pg.evaluate(async ([f, v]) => { globalThis.THUMB = v; await window.renderFrame(f); return await window.renderFrame(f); }, [+frame, variants[i]]);
  fs.writeFileSync(`${outDir}/v${i}.jpg`, Buffer.from(url.split(",")[1], "base64"));
}
await browser.close(); srv.close();
