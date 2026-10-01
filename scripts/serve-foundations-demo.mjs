import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const root = path.join(repo, "skill", "dreative", "systems");
// The motion recipes lab loads the real gsap and lenis builds installed as dev dependencies.
const vendor = { gsap: path.join(repo, "node_modules", "gsap", "dist"), lenis: path.join(repo, "node_modules", "lenis", "dist") };
const port = Number(process.env.DREATIVE_DEMO_PORT ?? 4177);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8" };

http.createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const relative = pathname === "/" ? "demo.html" : pathname.slice(1);
  const vendored = /^vendor\/(gsap|lenis)\/([\w.-]+\.js)$/.exec(relative);
  const base = vendored ? vendor[vendored[1]] : root;
  const file = path.resolve(base, vendored ? vendored[2] : relative);
  if (!file.startsWith(`${base}${path.sep}`) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    response.writeHead(404).end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => console.log(`foundations demo http://127.0.0.1:${port}`));
