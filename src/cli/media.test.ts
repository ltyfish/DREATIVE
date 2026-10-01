import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { generateImages, imageInfo, probeMedia, searchImages } from "./media.js";

// 1x1 PNG and a minimal JPEG header with an SOF0 segment (3x2).
const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "base64");
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x04, 0x00, 0x00, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x02, 0x00, 0x03, 0x01, 0x01, 0x11, 0x00, 0xff, 0xd9, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const dir = () => fs.mkdtempSync(path.join(os.tmpdir(), "dreative-media-gen-"));
type Call = { url: string; init?: RequestInit };
function fakeFetch(routes: (url: string, init?: RequestInit) => Response | Promise<Response>, calls: Call[] = []) {
  return (async (input: any, init?: RequestInit) => { const url = String(input); calls.push({ url, init }); return routes(url, init); }) as typeof fetch;
}
const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

test("image validation reads real dimensions and rejects error pages", () => {
  assert.deepEqual(imageInfo(PNG), { type: "png", width: 1, height: 1 });
  assert.deepEqual(imageInfo(JPEG), { type: "jpeg", width: 3, height: 2 });
  assert.equal(imageInfo(Buffer.from("<!doctype html><title>Error</title>")), null);
});

test("probe reports key names, never values, and recommends a keyed provider first", () => {
  const report = probeMedia({ GEMINI_API_KEY: "secret-value", PEXELS_API_KEY: "x" }, () => false);
  assert.equal(report.generators.find((g) => g.id === "gemini")!.ready, true);
  assert.equal(report.generators.find((g) => g.id === "openai")!.ready, false);
  assert.equal(report.photoSources.find((s) => s.id === "pexels")!.ready, true);
  assert.match(report.recommendation, /gemini/);
  assert.doesNotMatch(JSON.stringify(report), /secret-value/);
  assert.match(probeMedia({}, () => false).recommendation, /placeholder/);
  assert.match(probeMedia({}, () => false, "codex").recommendation, /image_gen/);
});

test("openai generation writes validated images, manifest and contact sheet", async () => {
  const out = dir(), calls: Call[] = [];
  try {
    const fetcher = fakeFetch(() => jsonResponse({ data: [{ b64_json: PNG.toString("base64") }, { b64_json: PNG.toString("base64") }] }), calls);
    const results = await generateImages({ prompt: "navy chore jacket, flat lay", out, name: "chore", count: 2, aspect: "3:4", env: { OPENAI_API_KEY: "k" }, fetcher });
    assert.deepEqual(results.map((r) => r.file), ["chore-1.png", "chore-2.png"]);
    assert.equal(results[0].provider, "openai");
    assert.equal(results[0].quality, "production");
    assert.equal(JSON.parse(String(calls[0].init!.body)).size, "1024x1536");
    assert.equal(JSON.parse(fs.readFileSync(path.join(out, "generated.json"), "utf8")).length, 2);
    assert.match(fs.readFileSync(path.join(out, "contact.html"), "utf8"), /chore-1\.png/);
    // A second call never overwrites earlier files.
    const again = await generateImages({ prompt: "x", out, name: "chore", count: 2, env: { OPENAI_API_KEY: "k" }, fetcher });
    assert.deepEqual(again.map((r) => r.file), ["chore-1-2.png", "chore-2-2.png"]);
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test("gemini generation sends reference images inline and the aspect ratio", async () => {
  const out = dir(), calls: Call[] = [];
  try {
    const ref = path.join(out, "ref.png"); fs.writeFileSync(ref, PNG);
    const fetcher = fakeFetch(() => jsonResponse({ candidates: [{ content: { parts: [{ text: "ok" }, { inlineData: { data: JPEG.toString("base64") } }] } }] }), calls);
    const [result] = await generateImages({ prompt: "same jacket, back view", out: path.join(out, "o"), refs: [ref], aspect: "4:5", env: { GEMINI_API_KEY: "g", FAL_KEY: "f" }, fetcher });
    assert.equal(result.provider, "gemini");
    assert.equal(result.file.endsWith(".jpg"), true);
    const body = JSON.parse(String(calls[0].init!.body));
    assert.equal(body.generationConfig.imageConfig.aspectRatio, "4:5");
    assert.equal(body.contents[0].parts[1].inline_data.mime_type, "image/png");
    assert.equal((calls[0].init!.headers as Record<string, string>)["x-goog-api-key"], "g");
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test("provider selection fails clearly instead of faking output", async () => {
  const out = dir();
  try {
    await assert.rejects(generateImages({ prompt: "x", out, provider: "openai", env: {}, fetcher: fakeFetch(() => jsonResponse({})) }), /OPENAI_API_KEY/);
    await assert.rejects(generateImages({ prompt: "x", out, provider: "fal", refs: [], env: { FAL_KEY: "f" }, fetcher: fakeFetch(() => jsonResponse({ images: [] })) }), /no images/);
    const ref = path.join(out, "r.png"); fs.writeFileSync(ref, PNG);
    await assert.rejects(generateImages({ prompt: "x", out, refs: [ref], env: { FAL_KEY: "f" }, fetcher: fakeFetch(() => jsonResponse({})) }), /OPENAI_API_KEY or GEMINI_API_KEY/);
    await assert.rejects(generateImages({ prompt: "x", out, env: {}, fetcher: fakeFetch(() => new Response(JPEG)) }), /NO_IMAGE_GENERATOR/);
    await assert.rejects(generateImages({ prompt: "x", out, provider: "pollinations", env: {}, fetcher: fakeFetch(() => new Response("<html>busy</html>")) }), /not an image/);
    await assert.rejects(generateImages({ prompt: "x", out, provider: "openai", env: { OPENAI_API_KEY: "k" }, fetcher: fakeFetch(() => jsonResponse({ error: "nope" }, 429)) }), /rate limited/);
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test("keyless fallback is labelled exploration quality", async () => {
  const out = dir(), calls: Call[] = [];
  try {
    const [r] = await generateImages({ prompt: "linen shirt", out, seed: 4, provider: "pollinations", env: {}, fetcher: fakeFetch(() => new Response(JPEG), calls) });
    assert.equal(r.provider, "pollinations");
    assert.equal(r.quality, "exploration");
    assert.match(calls[0].url, /seed=4/);
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});

test("search downloads candidates with attribution and records failures per source", async () => {
  const out = dir();
  try {
    const fetcher = fakeFetch((url) => {
      if (url.startsWith("https://api.openverse.org")) return jsonResponse({ results: [
        { url: "https://img.example/a.jpg", thumbnail: "https://img.example/a-thumb.jpg", title: "Wool", creator: "Ann", license: "by", license_version: "4.0", foreign_landing_url: "https://example/a" },
        { url: "https://img.example/broken", thumbnail: "https://img.example/broken-thumb", title: "Gone", creator: "Bo", license: "cc0", foreign_landing_url: "https://example/b" },
      ] });
      if (url === "https://img.example/a.jpg") return new Response(JPEG);
      return new Response("<html>404</html>");
    });
    const { images, failures } = await searchImages({ query: "herringbone wool macro", out, count: 2, env: {}, fetcher });
    assert.equal(images.length, 1);
    assert.equal(images[0].license, "BY 4.0");
    assert.match(images[0].attribution, /Ann/);
    assert.match(failures.join("\n"), /could not download https:\/\/example\/b/);
    assert.equal(JSON.parse(fs.readFileSync(path.join(out, "sources.json"), "utf8"))[0].landingUrl, "https://example/a");
    const keyed = await searchImages({ query: "q", out, source: "pexels", env: {}, fetcher });
    assert.match(keyed.failures[0], /PEXELS_API_KEY/);
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});
