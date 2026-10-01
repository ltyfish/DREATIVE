import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

// Provider-neutral asset production for hosts without a built-in image tool.
// Keys are read from the environment by name only; values are never printed.

export type Provider = "openai" | "gemini" | "fal" | "replicate" | "pollinations";
export type PhotoSource = "openverse" | "pexels" | "unsplash" | "pixabay";
type Env = Record<string, string | undefined>;
type Fetch = typeof fetch;

const PROVIDER_ORDER: Provider[] = ["openai", "gemini", "fal", "replicate", "pollinations"];
const REF_PROVIDERS = new Set<Provider>(["openai", "gemini"]);
const ASPECTS = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"] as const;
export type Aspect = typeof ASPECTS[number];

function key(env: Env, ...names: string[]): string | undefined {
  for (const name of names) if (env[name]?.trim()) return env[name]!.trim();
  return undefined;
}

export function providerKey(provider: Provider, env: Env): string | undefined {
  switch (provider) {
    case "openai": return key(env, "OPENAI_API_KEY");
    case "gemini": return key(env, "GEMINI_API_KEY", "GOOGLE_API_KEY");
    case "fal": return key(env, "FAL_KEY", "FAL_API_KEY");
    case "replicate": return key(env, "REPLICATE_API_TOKEN");
    case "pollinations": return key(env, "POLLINATIONS_TOKEN");
  }
}

function sourceKey(source: PhotoSource, env: Env): string | undefined {
  switch (source) {
    case "openverse": return undefined;
    case "pexels": return key(env, "PEXELS_API_KEY");
    case "unsplash": return key(env, "UNSPLASH_ACCESS_KEY");
    case "pixabay": return key(env, "PIXABAY_API_KEY");
  }
}

// ---------- image validation ----------

export function imageInfo(bytes: Uint8Array): { type: "png" | "jpeg" | "webp"; width: number; height: number } | null {
  const b = Buffer.from(bytes);
  if (b.length > 24 && b.readUInt32BE(0) === 0x89504e47) return { type: "png", width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.length > 30 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const chunk = b.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { type: "webp", width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    if (chunk === "VP8 ") return { type: "webp", width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === "VP8L") { const v = b.readUInt32LE(21); return { type: "webp", width: (v & 0x3fff) + 1, height: ((v >> 14) & 0x3fff) + 1 }; }
    return { type: "webp", width: 0, height: 0 };
  }
  if (b.length > 4 && b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker))
        return { type: "jpeg", height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
    return { type: "jpeg", width: 0, height: 0 };
  }
  return null;
}

function dimensions(aspect: Aspect, longEdge: number, multiple: number): { width: number; height: number } {
  const [w, h] = aspect.split(":").map(Number);
  const scale = longEdge / Math.max(w, h);
  const round = (v: number) => Math.max(multiple, Math.round(v / multiple) * multiple);
  return { width: round(w * scale), height: round(h * scale) };
}

function openaiSize(aspect: Aspect): string {
  const [w, h] = aspect.split(":").map(Number);
  return w === h ? "1024x1024" : h > w ? "1024x1536" : "1536x1024";
}

const nearest = (aspect: Aspect, allowed: string[]): string => {
  const [w, h] = aspect.split(":").map(Number);
  return allowed.reduce((best, item) => {
    const [a, b] = item.split(":").map(Number);
    const [x, y] = best.split(":").map(Number);
    return Math.abs(Math.log(a / b) - Math.log(w / h)) < Math.abs(Math.log(x / y) - Math.log(w / h)) ? item : best;
  });
};

async function download(fetcher: Fetch, url: string, headers: Record<string, string> = {}): Promise<Uint8Array> {
  const response = await fetcher(url, { headers, signal: AbortSignal.timeout(90_000) });
  if (!response.ok) throw new Error(`download ${response.status} from ${new URL(url).host}`);
  return new Uint8Array(await response.arrayBuffer());
}

async function json(response: Response, provider: string): Promise<any> {
  const text = await response.text();
  if (!response.ok) {
    const hint = response.status === 401 || response.status === 403 ? " (check the key/permissions)"
      : response.status === 402 ? " (payment or registration required)"
      : response.status === 429 ? " (rate limited; back off before retrying)" : "";
    throw new Error(`${provider} HTTP ${response.status}${hint}: ${text.slice(0, 400)}`);
  }
  try { return JSON.parse(text); } catch { throw new Error(`${provider} returned non-JSON: ${text.slice(0, 200)}`); }
}

// ---------- probe ----------

export interface ProbeReport {
  generators: { id: Provider; ready: boolean; via: string; referenceImages: boolean; note: string }[];
  photoSources: { id: PhotoSource; ready: boolean; via: string }[];
  localTools: { id: string; ready: boolean }[];
  recommendation: string;
}

function toolReady(binary: string, args: string[]): boolean {
  const result = spawnSync(binary, args, { windowsHide: true, timeout: 8000, encoding: "utf8" });
  return result.status === 0;
}

export function probeMedia(env: Env = process.env, checkTool: (b: string, a: string[]) => boolean = toolReady, host: "codex" | "claude" | "unknown" = "unknown"): ProbeReport {
  const notes: Record<Provider, string> = {
    openai: "gpt-image class; best text rendering and edits with reference images",
    gemini: "Gemini image; strong reference-consistent edits and sets",
    fal: "FLUX via fal.run; strong photographic stills",
    replicate: "FLUX via Replicate; strong photographic stills",
    pollinations: "keyless fallback; low fidelity and watermarked without a token — exploration only",
  };
  const envNames: Record<Provider, string> = {
    openai: "OPENAI_API_KEY", gemini: "GEMINI_API_KEY|GOOGLE_API_KEY", fal: "FAL_KEY", replicate: "REPLICATE_API_TOKEN", pollinations: "POLLINATIONS_TOKEN (optional)",
  };
  const generators = PROVIDER_ORDER.map((id) => ({
    id, ready: id === "pollinations" ? true : Boolean(providerKey(id, env)), via: envNames[id],
    referenceImages: REF_PROVIDERS.has(id), note: notes[id],
  }));
  const photoSources = (["openverse", "pexels", "unsplash", "pixabay"] as PhotoSource[]).map((id) => ({
    id, ready: id === "openverse" || Boolean(sourceKey(id, env)),
    via: id === "openverse" ? "keyless" : id === "pexels" ? "PEXELS_API_KEY" : id === "unsplash" ? "UNSPLASH_ACCESS_KEY" : "PIXABAY_API_KEY",
  }));
  const localTools = [
    { id: "ffmpeg", ready: checkTool("ffmpeg", ["-version"]) },
    { id: "magick", ready: checkTool("magick", ["-version"]) },
    { id: "python-pillow", ready: checkTool("python", ["-c", "import PIL"]) || checkTool("python3", ["-c", "import PIL"]) },
    { id: "blender", ready: checkTool("blender", ["--version"]) },
  ];
  const strong = generators.filter((g) => g.ready && g.id !== "pollinations");
  const recommendation = host === "codex"
    ? "Codex: generate mockups and assets with the built-in image_gen tool, then copy each into the project with `dreative media import --latest-codex --shots .dreative/shots.json --shot <id>` (or --out/--name)."
    : strong.length
    ? `Generate with ${strong[0].id}: dreative media generate --provider ${strong[0].id}, or fill declared shots with dreative media fill --shots .dreative/shots.json.`
    : "No image generator here. Declare every needed image in .dreative/shots.json, run `dreative media placeholder --shots .dreative/shots.json`, and build around the placeholders. Tell the user which shots remain; they fill with a key (OPENAI_API_KEY, GEMINI_API_KEY, FAL_KEY, REPLICATE_API_TOKEN) via `dreative media fill`, or from Codex via `dreative media import`.";
  return { generators, photoSources, localTools, recommendation };
}

export function renderProbe(report: ProbeReport): string {
  const mark = (ready: boolean) => (ready ? "READY  " : "missing");
  return [
    "image generators:",
    ...report.generators.map((g) => `  ${mark(g.ready)} ${g.id.padEnd(12)} ${g.via.padEnd(30)} ${g.referenceImages ? "ref-images " : "           "}${g.note}`),
    "photo/footage search:",
    ...report.photoSources.map((s) => `  ${mark(s.ready)} ${s.id.padEnd(12)} ${s.via}`),
    "local production tools:",
    ...report.localTools.map((t) => `  ${mark(t.ready)} ${t.id}`),
    "",
    report.recommendation,
  ].join("\n");
}

// ---------- generate ----------

export interface GenerateOptions {
  prompt: string; out: string; name?: string; aspect?: Aspect; count?: number;
  provider?: Provider | "auto"; refs?: string[]; seed?: number; model?: string;
  env?: Env; fetcher?: Fetch;
}
export interface GeneratedImage {
  file: string; provider: Provider; model: string; prompt: string; aspect: Aspect; seed?: number;
  refs: string[]; width: number; height: number; bytes: number; sha256: string; createdAt: string;
  status: "generated"; quality: "production" | "exploration"; disclosure: string;
}

function pickProvider(requested: Provider | "auto", env: Env, wantsRef: boolean): Provider {
  if (requested !== "auto") {
    if (requested !== "pollinations" && !providerKey(requested, env))
      throw new Error(`${requested} is not configured: set ${probeMedia(env, () => false).generators.find((g) => g.id === requested)!.via}`);
    if (wantsRef && !REF_PROVIDERS.has(requested)) throw new Error(`${requested} does not accept --ref here; use openai or gemini for reference-guided images`);
    return requested;
  }
  const ready = PROVIDER_ORDER.filter((p) => p !== "pollinations" && providerKey(p, env) && (!wantsRef || REF_PROVIDERS.has(p)));
  if (ready.length) return ready[0];
  if (wantsRef) throw new Error("reference-guided generation needs OPENAI_API_KEY or GEMINI_API_KEY (or the host's own image-edit tool)");
  throw new Error("NO_IMAGE_GENERATOR: no keyed provider is configured. Codex: use the built-in image_gen tool, then `dreative media import`. "
    + "Claude/other hosts: declare shots in .dreative/shots.json and run `dreative media placeholder`; fill them later with a key or Codex. "
    + "(`--provider pollinations` gives keyless, watermarked exploration images.)");
}

const mime = (file: string) => /\.png$/i.test(file) ? "image/png" : /\.webp$/i.test(file) ? "image/webp" : "image/jpeg";

async function callProvider(provider: Provider, o: Required<Pick<GenerateOptions, "prompt" | "aspect" | "count">> & GenerateOptions, env: Env, fetcher: Fetch): Promise<{ model: string; images: Uint8Array[] }> {
  const auth = providerKey(provider, env);
  const refs = o.refs ?? [];
  if (provider === "openai") {
    const model = o.model ?? env.DREATIVE_OPENAI_IMAGE_MODEL ?? "gpt-image-1";
    let response: Response;
    if (refs.length) {
      const form = new FormData();
      form.set("model", model); form.set("prompt", o.prompt); form.set("size", openaiSize(o.aspect)); form.set("n", String(o.count));
      for (const ref of refs) form.append(refs.length > 1 ? "image[]" : "image", new Blob([fs.readFileSync(ref)], { type: mime(ref) }), path.basename(ref));
      response = await fetcher("https://api.openai.com/v1/images/edits", { method: "POST", headers: { Authorization: `Bearer ${auth}` }, body: form, signal: AbortSignal.timeout(300_000) });
    } else {
      response = await fetcher("https://api.openai.com/v1/images/generations", {
        method: "POST", headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt: o.prompt, size: openaiSize(o.aspect), n: o.count }), signal: AbortSignal.timeout(300_000),
      });
    }
    const data = await json(response, "openai");
    const images: Uint8Array[] = [];
    for (const item of data.data ?? []) {
      if (item.b64_json) images.push(Buffer.from(item.b64_json, "base64"));
      else if (item.url) images.push(await download(fetcher, item.url));
    }
    return { model, images };
  }
  if (provider === "gemini") {
    const model = o.model ?? env.DREATIVE_GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image";
    const images: Uint8Array[] = [];
    for (let i = 0; i < o.count; i++) {
      const parts: any[] = [{ text: o.prompt }, ...refs.map((ref) => ({ inline_data: { mime_type: mime(ref), data: fs.readFileSync(ref).toString("base64") } }))];
      const response = await fetcher(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
        method: "POST", headers: { "x-goog-api-key": auth!, "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }], generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: o.aspect } } }),
        signal: AbortSignal.timeout(300_000),
      });
      const data = await json(response, "gemini");
      const found = (data.candidates?.[0]?.content?.parts ?? []).map((p: any) => p.inlineData?.data ?? p.inline_data?.data).filter(Boolean);
      if (!found.length) throw new Error(`gemini returned no image (finish: ${data.candidates?.[0]?.finishReason ?? "unknown"})`);
      images.push(Buffer.from(found[0], "base64"));
    }
    return { model, images };
  }
  if (provider === "fal") {
    const model = o.model ?? env.DREATIVE_FAL_IMAGE_MODEL ?? "fal-ai/flux/dev";
    const response = await fetcher(`https://fal.run/${model}`, {
      method: "POST", headers: { Authorization: `Key ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: o.prompt, image_size: dimensions(o.aspect, 1440, 32), num_images: o.count, ...(o.seed !== undefined ? { seed: o.seed } : {}) }),
      signal: AbortSignal.timeout(300_000),
    });
    const data = await json(response, "fal");
    return { model, images: await Promise.all((data.images ?? []).map((img: any) => download(fetcher, img.url))) };
  }
  if (provider === "replicate") {
    const model = o.model ?? env.DREATIVE_REPLICATE_IMAGE_MODEL ?? "black-forest-labs/flux-1.1-pro";
    const images: Uint8Array[] = [];
    for (let i = 0; i < o.count; i++) {
      const response = await fetcher(`https://api.replicate.com/v1/models/${model}/predictions`, {
        method: "POST", headers: { Authorization: `Bearer ${auth}`, "Content-Type": "application/json", Prefer: "wait" },
        body: JSON.stringify({ input: { prompt: o.prompt, aspect_ratio: nearest(o.aspect, ["1:1", "16:9", "3:2", "2:3", "4:5", "5:4", "9:16", "3:4", "4:3"]), output_format: "png", ...(o.seed !== undefined ? { seed: o.seed + i } : {}) } }),
        signal: AbortSignal.timeout(300_000),
      });
      const data = await json(response, "replicate");
      const output = Array.isArray(data.output) ? data.output[0] : data.output;
      if (typeof output !== "string") throw new Error(`replicate prediction not finished (status ${data.status}); retry or poll ${data.urls?.get ?? "the prediction"}`);
      images.push(await download(fetcher, output));
    }
    return { model, images };
  }
  const model = o.model ?? env.DREATIVE_POLLINATIONS_MODEL ?? (auth ? "flux" : "sana");
  const size = dimensions(o.aspect, 1024, 16);
  const images: Uint8Array[] = [];
  for (let i = 0; i < o.count; i++) {
    const seed = (o.seed ?? Math.floor(Math.random() * 1e6)) + i;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(o.prompt)}?width=${size.width}&height=${size.height}&seed=${seed}&nologo=true&model=${encodeURIComponent(model)}`;
    images.push(await download(fetcher, url, auth ? { Authorization: `Bearer ${auth}` } : {}));
  }
  return { model, images };
}

export async function generateImages(options: GenerateOptions): Promise<GeneratedImage[]> {
  const env = options.env ?? process.env;
  const fetcher = options.fetcher ?? fetch;
  const aspect = options.aspect ?? "4:5";
  if (!ASPECTS.includes(aspect)) throw new Error(`--aspect must be one of ${ASPECTS.join(", ")}`);
  const count = options.count ?? 1;
  if (!Number.isInteger(count) || count < 1 || count > 8) throw new Error("--count must be an integer from 1 to 8");
  if (!options.prompt?.trim()) throw new Error("--prompt is required");
  const refs = (options.refs ?? []).map((ref) => path.resolve(ref));
  for (const ref of refs) if (!fs.existsSync(ref) || !imageInfo(fs.readFileSync(ref))) throw new Error(`reference is not a readable PNG/JPEG/WebP: ${ref}`);
  const provider = pickProvider(options.provider ?? "auto", env, refs.length > 0);
  const { model, images } = await callProvider(provider, { ...options, aspect, count, refs }, env, fetcher);
  if (!images.length) throw new Error(`${provider} returned no images`);
  fs.mkdirSync(options.out, { recursive: true });
  const base = (options.name ?? options.prompt.split(/\s+/).slice(0, 5).join("-")).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") || "image";
  const manifestPath = path.join(options.out, "generated.json");
  const manifest: GeneratedImage[] = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : [];
  const results: GeneratedImage[] = [];
  images.forEach((bytes, i) => {
    const info = imageInfo(bytes);
    if (!info) throw new Error(`${provider} returned bytes that are not an image (first bytes: ${Buffer.from(bytes.slice(0, 16)).toString("utf8").replace(/\s+/g, " ")})`);
    const ext = info.type === "jpeg" ? "jpg" : info.type;
    const stem = images.length > 1 ? `${base}-${i + 1}` : base;
    let file = `${stem}.${ext}`;
    for (let n = 2; fs.existsSync(path.join(options.out, file)); n++) file = `${stem}-${n}.${ext}`;
    fs.writeFileSync(path.join(options.out, file), bytes);
    results.push({
      file, provider, model, prompt: options.prompt, aspect, seed: options.seed, refs: refs.map((r) => path.relative(options.out, r)),
      width: info.width, height: info.height, bytes: bytes.length, sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
      createdAt: new Date().toISOString(), status: "generated",
      quality: provider === "pollinations" && !providerKey("pollinations", env) ? "exploration" : "production",
      disclosure: "Generated representative image; not a photograph of real inventory.",
    });
  });
  fs.writeFileSync(manifestPath, JSON.stringify([...manifest, ...results], null, 2));
  writeContactSheet(options.out);
  return results;
}

// ---------- search ----------

export interface SearchOptions { query: string; out: string; source?: PhotoSource | "auto"; count?: number; env?: Env; fetcher?: Fetch }
export interface SourcedImage {
  file: string; source: PhotoSource; query: string; title: string; creator: string; license: string;
  licenseUrl?: string; landingUrl: string; width: number; height: number; attribution: string;
}
interface Candidate { source: PhotoSource; url: string; fallback?: string; title: string; creator: string; license: string; licenseUrl?: string; landingUrl: string; ping?: string }

async function findCandidates(source: PhotoSource, query: string, count: number, env: Env, fetcher: Fetch): Promise<Candidate[]> {
  const q = encodeURIComponent(query);
  const auth = sourceKey(source, env);
  if (source === "openverse") {
    const data = await json(await fetcher(`https://api.openverse.org/v1/images/?q=${q}&page_size=${count}&license_type=commercial,modification&mature=false`, { signal: AbortSignal.timeout(30_000) }), "openverse");
    return (data.results ?? []).map((r: any) => ({ source, url: r.url, fallback: r.thumbnail, title: r.title ?? "", creator: r.creator ?? "unknown",
      license: `${String(r.license ?? "").toUpperCase()} ${r.license_version ?? ""}`.trim(), licenseUrl: r.license_url, landingUrl: r.foreign_landing_url ?? r.url }));
  }
  if (!auth) throw new Error(`${source} needs ${source === "pexels" ? "PEXELS_API_KEY" : source === "unsplash" ? "UNSPLASH_ACCESS_KEY" : "PIXABAY_API_KEY"}`);
  if (source === "pexels") {
    const data = await json(await fetcher(`https://api.pexels.com/v1/search?query=${q}&per_page=${count}`, { headers: { Authorization: auth }, signal: AbortSignal.timeout(30_000) }), "pexels");
    return (data.photos ?? []).map((p: any) => ({ source, url: p.src?.large2x ?? p.src?.original, fallback: p.src?.medium, title: p.alt ?? "", creator: p.photographer ?? "unknown", license: "Pexels License", licenseUrl: "https://www.pexels.com/license/", landingUrl: p.url }));
  }
  if (source === "unsplash") {
    const data = await json(await fetcher(`https://api.unsplash.com/search/photos?query=${q}&per_page=${count}`, { headers: { Authorization: `Client-ID ${auth}` }, signal: AbortSignal.timeout(30_000) }), "unsplash");
    return (data.results ?? []).map((p: any) => ({ source, url: `${p.urls?.raw}&w=2000&q=85&fm=jpg`, fallback: p.urls?.small, title: p.alt_description ?? "", creator: p.user?.name ?? "unknown", license: "Unsplash License", licenseUrl: "https://unsplash.com/license", landingUrl: p.links?.html, ping: p.links?.download_location }));
  }
  const data = await json(await fetcher(`https://pixabay.com/api/?key=${encodeURIComponent(auth)}&q=${q}&image_type=photo&per_page=${Math.max(3, count)}&safesearch=true`, { signal: AbortSignal.timeout(30_000) }), "pixabay");
  return (data.hits ?? []).slice(0, count).map((p: any) => ({ source, url: p.largeImageURL, fallback: p.webformatURL, title: p.tags ?? "", creator: p.user ?? "unknown", license: "Pixabay Content License", licenseUrl: "https://pixabay.com/service/license-summary/", landingUrl: p.pageURL }));
}

export async function searchImages(options: SearchOptions): Promise<{ images: SourcedImage[]; failures: string[] }> {
  const env = options.env ?? process.env;
  const fetcher = options.fetcher ?? fetch;
  const count = options.count ?? 12;
  if (!options.query?.trim()) throw new Error("--query is required");
  if (!Number.isInteger(count) || count < 1 || count > 40) throw new Error("--count must be an integer from 1 to 40");
  const requested = options.source ?? "auto";
  const sources: PhotoSource[] = requested === "auto"
    ? [...(["pexels", "unsplash", "pixabay"] as PhotoSource[]).filter((s) => sourceKey(s, env)), "openverse"]
    : [requested];
  fs.mkdirSync(options.out, { recursive: true });
  const manifestPath = path.join(options.out, "sources.json");
  const manifest: SourcedImage[] = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, "utf8")) : [];
  const images: SourcedImage[] = [], failures: string[] = [];
  const slug = options.query.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "image";
  for (const source of sources) {
    let candidates: Candidate[];
    try { candidates = await findCandidates(source, options.query, count, env, fetcher); }
    catch (error) { failures.push(`${source}: ${(error as Error).message}`); continue; }
    if (!candidates.length) failures.push(`${source}: no results for "${options.query}" — try shot language (view, light, material) rather than names`);
    let index = 0;
    for (const c of candidates) {
      index++;
      let bytes: Uint8Array | undefined, info: ReturnType<typeof imageInfo> = null;
      for (const url of [c.url, c.fallback].filter(Boolean) as string[]) {
        try { bytes = await download(fetcher, url); info = imageInfo(bytes); if (info) break; } catch { /* try fallback */ }
      }
      if (!bytes || !info) { failures.push(`${source}: could not download ${c.landingUrl}`); continue; }
      if (c.ping) { try { await fetcher(c.ping, { headers: { Authorization: `Client-ID ${sourceKey("unsplash", env)}` } }); } catch { /* guideline ping only */ } }
      let file = `${source}-${slug}-${index}.${info.type === "jpeg" ? "jpg" : info.type}`;
      for (let n = 2; fs.existsSync(path.join(options.out, file)); n++) file = `${source}-${slug}-${index}-${n}.${info.type === "jpeg" ? "jpg" : info.type}`;
      fs.writeFileSync(path.join(options.out, file), bytes);
      images.push({ file, source, query: options.query, title: c.title, creator: c.creator, license: c.license, licenseUrl: c.licenseUrl,
        landingUrl: c.landingUrl, width: info.width, height: info.height,
        attribution: `“${c.title || "Untitled"}” by ${c.creator}, ${c.license}${c.landingUrl ? `, ${c.landingUrl}` : ""}` });
    }
  }
  fs.writeFileSync(manifestPath, JSON.stringify([...manifest, ...images], null, 2));
  writeContactSheet(options.out);
  return { images, failures };
}

// ---------- contact sheet ----------

const escape = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));

export function writeContactSheet(dir: string): string {
  const read = (name: string) => (fs.existsSync(path.join(dir, name)) ? JSON.parse(fs.readFileSync(path.join(dir, name), "utf8")) : []);
  const items = [
    ...read("generated.json").map((g: GeneratedImage) => ({ file: g.file, label: `${g.provider}/${g.model} · ${g.width}×${g.height} · ${g.quality}`, detail: g.prompt })),
    ...read("sources.json").map((s: SourcedImage) => ({ file: s.file, label: `${s.source} · ${s.width}×${s.height} · ${s.license}`, detail: s.attribution })),
  ];
  const html = `<!doctype html><meta charset="utf-8"><title>Contact sheet</title>
<style>body{margin:0;padding:16px;background:#111;color:#ddd;font:12px/1.4 system-ui}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
figure{margin:0;background:#1b1b1b}img{width:100%;height:260px;object-fit:contain;background:#222;display:block}figcaption{padding:6px 8px}b{display:block;color:#fff}</style>
<main>${items.map((i) => `<figure><img src="${encodeURI(i.file)}" alt=""><figcaption><b>${escape(i.file)}</b>${escape(i.label)}<br>${escape(i.detail.slice(0, 220))}</figcaption></figure>`).join("\n")}</main>`;
  const file = path.join(dir, "contact.html");
  fs.writeFileSync(file, html);
  return file;
}

export function parseAspect(raw: string | undefined): Aspect | undefined {
  if (raw === undefined) return undefined;
  if (!ASPECTS.includes(raw as Aspect)) throw new Error(`--aspect must be one of ${ASPECTS.join(", ")}`);
  return raw as Aspect;
}
