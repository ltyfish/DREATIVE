import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { generateImages, imageInfo, type Aspect, type Provider } from "./media.js";

// A shot list declares every image the design needs before any exists. Placeholders keep the
// layout honest while material is missing; fill/import swap in real images and rewrite references.

export type ShotStatus = "placeholder" | "generated" | "imported" | "sourced" | "supplied" | "missing";
export interface Shot {
  id: string; path: string; aspect: Aspect; prompt: string; role?: string;
  status?: ShotStatus; file?: string; provider?: string; source?: string; sha256?: string; updatedAt?: string;
}
export interface ShotList { version: 1; shots: Shot[] }

const IMAGE_EXT = ["png", "jpg", "jpeg", "webp", "avif"];
const SOURCE_EXT = /\.(jsx?|tsx?|mjs|cjs|vue|svelte|astro|html?|css|scss|sass|less|json|mdx?)$/i;
const SKIP_DIR = new Set(["node_modules", "dist", "build", ".next", ".nuxt", ".svelte-kit", ".output", ".git", ".dreative", ".codex", ".claude", "coverage"]);

export function readShots(file: string): ShotList {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const list: ShotList = Array.isArray(raw) ? { version: 1, shots: raw } : raw;
  const ids = new Set<string>();
  for (const shot of list.shots ?? []) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(shot.id ?? "")) throw new Error(`shot id must be kebab-case: ${JSON.stringify(shot.id)}`);
    if (ids.has(shot.id)) throw new Error(`duplicate shot id: ${shot.id}`);
    ids.add(shot.id);
    if (!shot.path || /\.[a-z0-9]+$/i.test(path.basename(shot.path))) throw new Error(`shot ${shot.id}: path is a stem without extension, e.g. public/media/${shot.id}`);
    if (path.basename(shot.path) !== shot.id) throw new Error(`shot ${shot.id}: the file name must equal the id (path …/${shot.id})`);
    if (!shot.prompt?.trim()) throw new Error(`shot ${shot.id}: prompt (the shot brief) is required`);
    shot.aspect ??= "4:5";
  }
  return list;
}

function writeShots(file: string, list: ShotList) { fs.writeFileSync(file, JSON.stringify(list, null, 2) + "\n"); }

/** Project root for a shot list: the parent of `.dreative/`, else the list's own directory. */
export function projectRootFor(file: string): string {
  const dir = path.dirname(path.resolve(file));
  return path.basename(dir) === ".dreative" ? path.dirname(dir) : dir;
}

function existingImage(root: string, shot: Shot): string | undefined {
  for (const ext of IMAGE_EXT) { const f = path.join(root, `${shot.path}.${ext}`); if (fs.existsSync(f)) return f; }
  return undefined;
}

const escapeXml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]!));
function wrap(text: string, width: number, maxLines: number): string[] {
  const lines: string[] = []; let line = "";
  for (const word of text.split(/\s+/)) {
    if ((line + " " + word).trim().length > width) { lines.push(line.trim()); line = word; } else line += " " + word;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line.trim()) lines.push(line.trim());
  if (lines.length === maxLines && text.length > lines.join(" ").length) lines[maxLines - 1] = lines[maxLines - 1].replace(/.{0,1}$/, "…");
  return lines;
}

export function placeholderSvg(shot: Shot): string {
  const [w, h] = shot.aspect.split(":").map(Number);
  const W = 1600, H = Math.round((1600 * h) / w);
  const base = Math.max(22, Math.round(Math.min(W, H) / 28));
  const lines = wrap(shot.prompt, Math.max(24, Math.round(W / (base * 0.58))), 7);
  const y0 = H / 2 - ((lines.length + 2) * base * 1.35) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" data-dreative-placeholder="${shot.id}" role="img" aria-label="Placeholder: ${escapeXml(shot.id)}">
<rect width="${W}" height="${H}" fill="#cfcac2"/>
<path d="M0 0L${W} ${H}M${W} 0L0 ${H}" stroke="#bdb7ad" stroke-width="2"/>
<rect x="12" y="12" width="${W - 24}" height="${H - 24}" fill="none" stroke="#8f887d" stroke-width="2" stroke-dasharray="14 10"/>
<g font-family="ui-monospace, Menlo, Consolas, monospace" fill="#3d3832" text-anchor="middle">
<text x="${W / 2}" y="${y0}" font-size="${base}" font-weight="700" letter-spacing="2">PLACEHOLDER · ${escapeXml(shot.id.toUpperCase())} · ${shot.aspect}${shot.role ? ` · ${escapeXml(shot.role.toUpperCase())}` : ""}</text>
${lines.map((l, i) => `<text x="${W / 2}" y="${y0 + (i + 2) * base * 1.35}" font-size="${Math.round(base * 0.8)}">${escapeXml(l)}</text>`).join("\n")}
</g></svg>
`;
}

/** Replace references to `<id>.svg` in project source with the new file name. */
export function rewriteReferences(root: string, shot: Shot, newFile: string): string[] {
  const changed: string[] = [];
  const pattern = new RegExp(`(?<=[/\\\\"'(\`=\\s]|^)${shot.id}\\.svg(?![\\w.-])`, "g");
  const replacement = path.basename(newFile);
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) { if (!SKIP_DIR.has(entry.name)) walk(path.join(dir, entry.name)); continue; }
      if (!SOURCE_EXT.test(entry.name) || entry.name === "shots.json") continue;
      const file = path.join(dir, entry.name);
      const text = fs.readFileSync(file, "utf8");
      if (!pattern.test(text)) continue;
      pattern.lastIndex = 0;
      fs.writeFileSync(file, text.replace(pattern, replacement));
      changed.push(path.relative(root, file));
    }
  };
  walk(root);
  return changed;
}

export function placeShots(file: string): { created: string[]; skipped: string[] } {
  const list = readShots(file), root = projectRootFor(file);
  const created: string[] = [], skipped: string[] = [];
  for (const shot of list.shots) {
    const real = existingImage(root, shot);
    if (real) { skipped.push(`${shot.id} (has ${path.relative(root, real).replace(/\\/g, "/")})`); continue; }
    const target = path.join(root, `${shot.path}.svg`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, placeholderSvg(shot));
    Object.assign(shot, { status: "placeholder", file: path.relative(root, target).replace(/\\/g, "/"), updatedAt: new Date().toISOString() });
    created.push(shot.file!);
  }
  writeShots(file, list);
  return { created, skipped };
}

function install(root: string, shot: Shot, bytes: Uint8Array, status: ShotStatus, extra: Partial<Shot>): { file: string; rewritten: string[] } {
  const info = imageInfo(bytes);
  if (!info) throw new Error(`${shot.id}: not a PNG/JPEG/WebP image`);
  const ext = info.type === "jpeg" ? "jpg" : info.type;
  const target = path.join(root, `${shot.path}.${ext}`);
  for (const other of IMAGE_EXT) { const f = path.join(root, `${shot.path}.${other}`); if (f !== target && fs.existsSync(f)) fs.rmSync(f); }
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes);
  const svg = path.join(root, `${shot.path}.svg`);
  const rewritten = rewriteReferences(root, shot, target);
  if (fs.existsSync(svg) && fs.readFileSync(svg, "utf8").includes("data-dreative-placeholder")) fs.rmSync(svg);
  Object.assign(shot, { status, file: path.relative(root, target).replace(/\\/g, "/"), sha256: crypto.createHash("sha256").update(bytes).digest("hex"), updatedAt: new Date().toISOString(), ...extra });
  return { file: shot.file!, rewritten };
}

export async function fillShots(file: string, options: { provider?: Provider | "auto"; only?: string[]; env?: Record<string, string | undefined>; fetcher?: typeof fetch } = {}) {
  const list = readShots(file), root = projectRootFor(file);
  const done: { id: string; file: string; rewritten: string[] }[] = [];
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-fill-"));
  try {
    for (const shot of list.shots) {
      if (options.only?.length ? !options.only.includes(shot.id) : !(shot.status === "placeholder" || !existingImage(root, shot))) continue;
      const [result] = await generateImages({ prompt: shot.prompt, out: tmp, name: shot.id, aspect: shot.aspect, provider: options.provider ?? "auto", env: options.env, fetcher: options.fetcher });
      const outcome = install(root, shot, fs.readFileSync(path.join(tmp, result.file)), "generated", { provider: `${result.provider}/${result.model}` });
      done.push({ id: shot.id, ...outcome });
      writeShots(file, list);
    }
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
  return done;
}

/** Newest image Codex's built-in generator wrote (CODEX_HOME/generated_images/<session>/*). */
export function latestCodexImage(codexHome = process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex")): string {
  const root = path.join(codexHome, "generated_images");
  if (!fs.existsSync(root)) throw new Error(`no Codex generated images at ${root}`);
  let best: { file: string; mtime: number } | undefined;
  for (const session of fs.readdirSync(root, { withFileTypes: true })) {
    const dir = session.isDirectory() ? path.join(root, session.name) : root;
    const names = session.isDirectory() ? fs.readdirSync(dir) : [session.name];
    for (const name of names) {
      if (!/\.(png|jpe?g|webp)$/i.test(name)) continue;
      const f = path.join(dir, name), mtime = fs.statSync(f).mtimeMs;
      if (!best || mtime > best.mtime) best = { file: f, mtime };
    }
  }
  if (!best) throw new Error(`no images found under ${root}`);
  return best.file;
}

export function importImage(options: { from: string; shots?: string; shot?: string; out?: string; name?: string; source?: string }) {
  const bytes = fs.readFileSync(options.from);
  if (!imageInfo(bytes)) throw new Error(`not a PNG/JPEG/WebP image: ${options.from}`);
  if (options.shots) {
    if (!options.shot) throw new Error("--shot <id> is required with --shots");
    const list = readShots(options.shots), root = projectRootFor(options.shots);
    const shot = list.shots.find((s) => s.id === options.shot);
    if (!shot) throw new Error(`no shot ${options.shot} in ${options.shots}`);
    const outcome = install(root, shot, bytes, "imported", { source: options.source ?? path.basename(options.from) });
    writeShots(options.shots, list);
    return outcome;
  }
  if (!options.out || !options.name) throw new Error("media import needs --shots/--shot or --out/--name");
  const info = imageInfo(bytes)!;
  const target = path.join(options.out, `${options.name}.${info.type === "jpeg" ? "jpg" : info.type}`);
  fs.mkdirSync(options.out, { recursive: true });
  fs.writeFileSync(target, bytes);
  return { file: target, rewritten: [] as string[] };
}

export function shotStatus(file: string): { rows: { id: string; status: string; file: string; role: string }[]; open: number } {
  const list = readShots(file), root = projectRootFor(file);
  const rows = list.shots.map((shot) => {
    const real = existingImage(root, shot);
    const status = real ? (shot.status && shot.status !== "placeholder" ? shot.status : "supplied") : fs.existsSync(path.join(root, `${shot.path}.svg`)) ? "placeholder" : "missing";
    return { id: shot.id, status, file: real ? path.relative(root, real).replace(/\\/g, "/") : `${shot.path}.svg`, role: shot.role ?? "" };
  });
  return { rows, open: rows.filter((r) => r.status === "placeholder" || r.status === "missing").length };
}
