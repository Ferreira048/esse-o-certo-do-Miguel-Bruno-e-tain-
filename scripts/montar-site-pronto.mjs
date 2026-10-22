// Rebuilds site-pronto/: plain HTML pages that open with Go Live, from any
// folder, or even by double-clicking index.html (no Node needed to view them).
// Run from the project root: node scripts/montar-site-pronto.mjs
// Needs the dev server running on :8080 to copy the catalog photos.
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OUT = "site-pronto";
fs.rmSync("dist-static", { recursive: true, force: true });
execSync("npx vite build --config ./vite.static.config.ts", {
  stdio: "inherit",
  env: { ...process.env, VITE_STATIC_COPY: "1" },
});
fs.rmSync(OUT, { recursive: true, force: true });
fs.renameSync("dist-static/client", OUT);
fs.rmSync("dist-static", { recursive: true, force: true });

// Catalog photos live behind Lovable's asset host; copy them in as files.
for (const f of fs.readdirSync("src/assets/catalogo")) {
  const { url } = JSON.parse(fs.readFileSync(`src/assets/catalogo/${f}`, "utf8"));
  const res = await fetch(`http://localhost:8080${url}`);
  if (!res.ok) throw new Error(`photo ${url}: ${res.status}`);
  const dest = path.join(OUT, url);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

// Drop scripts (module scripts don't run from file://) and make every link relative.
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const file of walk(OUT).filter((f) => f.endsWith(".html"))) {
  const depth = path.relative(OUT, path.dirname(file)).split(path.sep).filter(Boolean).length;
  const up = "../".repeat(depth) || "./";
  let html = fs.readFileSync(file, "utf8");
  html = html
    .replace(/<script\b[\s\S]*?<\/script>/g, "")
    .replace(/<link rel="modulepreload"[^>]*>/g, "")
    .replace(/(href|src)="\/(?!\/)([^"]*)"/g, (_, attr, p) => {
      const clean = p.split(/[?#]/)[0];
      const isPage = !/\.[a-z0-9]+$/i.test(clean);
      const target = isPage ? `${clean ? clean.replace(/\/$/, "") + "/" : ""}index.html` : p;
      return `${attr}="${up}${target}"`;
    });
  fs.writeFileSync(file, html);
}
console.log("site-pronto pronto");
