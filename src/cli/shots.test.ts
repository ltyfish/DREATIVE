import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fillShots, importImage, latestCodexImage, placeShots, readShots, shotStatus } from "./shots.js";
import { runDoctor } from "./doctor.js";

const PNG = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAAABJRU5ErkJggg==", "base64");

function project() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-shots-"));
  fs.mkdirSync(path.join(root, ".dreative"));
  fs.mkdirSync(path.join(root, "src"));
  fs.writeFileSync(path.join(root, ".dreative", "shots.json"), JSON.stringify({ version: 1, shots: [
    { id: "hero", path: "public/media/hero", aspect: "16:9", role: "hero", prompt: "Wide editorial photograph of a tailor's cutting table at dawn, bolts of navy wool, soft window light" },
    { id: "item-01", path: "public/media/item-01", aspect: "4:5", prompt: "Navy chore jacket, studio, warm grey background" },
  ] }));
  fs.writeFileSync(path.join(root, "src", "App.jsx"), `const hero = "/media/hero.svg"; const a = '/media/item-01.svg'; const keep = "/media/hero.svg.bak"; const other = "/media/superhero.svg";`);
  fs.writeFileSync(path.join(root, "src", "styles.css"), `.h{background:url(/media/hero.svg)}`);
  return root;
}

test("shot lists are validated so files and references stay predictable", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-shots-bad-"));
  try {
    const file = path.join(root, "shots.json");
    for (const shots of [[{ id: "Hero", path: "p/Hero", prompt: "x" }], [{ id: "a", path: "p/a.png", prompt: "x" }], [{ id: "a", path: "p/b", prompt: "x" }], [{ id: "a", path: "p/a", prompt: "" }], [{ id: "a", path: "p/a", prompt: "x" }, { id: "a", path: "q/a", prompt: "y" }]]) {
      fs.writeFileSync(file, JSON.stringify(shots));
      assert.throws(() => readShots(file));
    }
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("placeholders carry the brief, then import swaps the real image and rewrites only exact references", () => {
  const root = project(), shots = path.join(root, ".dreative", "shots.json");
  try {
    const { created } = placeShots(shots);
    assert.deepEqual(created, ["public/media/hero.svg", "public/media/item-01.svg"]);
    const svg = fs.readFileSync(path.join(root, "public/media/hero.svg"), "utf8");
    assert.match(svg, /data-dreative-placeholder="hero"/);
    assert.match(svg, /viewBox="0 0 1600 900"/);
    assert.match(svg, /cutting table/);
    assert.equal(shotStatus(shots).open, 2);

    const generated = path.join(root, "codex.png"); fs.writeFileSync(generated, PNG);
    const result = importImage({ from: generated, shots, shot: "hero", source: "codex image_gen" });
    assert.equal(result.file, "public/media/hero.png");
    assert.deepEqual(result.rewritten.sort(), [path.join("src", "App.jsx"), path.join("src", "styles.css")].sort());
    const app = fs.readFileSync(path.join(root, "src", "App.jsx"), "utf8");
    assert.match(app, /"\/media\/hero\.png"/);
    assert.match(app, /\/media\/hero\.svg\.bak/, "longer names are untouched");
    assert.match(app, /superhero\.svg/, "other ids are untouched");
    assert.match(app, /item-01\.svg/);
    assert.match(fs.readFileSync(path.join(root, "src", "styles.css"), "utf8"), /hero\.png/);
    assert.equal(fs.existsSync(path.join(root, "public/media/hero.svg")), false);
    const status = shotStatus(shots);
    assert.equal(status.open, 1);
    assert.equal(status.rows.find((r) => r.id === "hero")!.status, "imported");
    // A second pass refreshes open placeholders (briefs may change) and never touches a real image.
    const again = placeShots(shots);
    assert.deepEqual(again.created, ["public/media/item-01.svg"]);
    assert.match(again.skipped[0], /hero \(has public[\/]media[\/]hero\.png\)/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("fill generates open shots with a keyed provider and refuses without one", async () => {
  const root = project(), shots = path.join(root, ".dreative", "shots.json");
  try {
    placeShots(shots);
    await assert.rejects(fillShots(shots, { env: {} }), /NO_IMAGE_GENERATOR/);
    const fetcher = (async () => new Response(JSON.stringify({ data: [{ b64_json: PNG.toString("base64") }] }), { status: 200 })) as typeof fetch;
    const done = await fillShots(shots, { env: { OPENAI_API_KEY: "k" }, fetcher });
    assert.deepEqual(done.map((d) => d.id), ["hero", "item-01"]);
    assert.equal(shotStatus(shots).open, 0);
    assert.match(fs.readFileSync(path.join(root, "src", "App.jsx"), "utf8"), /item-01\.png/);
    assert.equal(readShots(shots).shots[0].provider, "openai/gpt-image-1");
    assert.deepEqual(await fillShots(shots, { env: { OPENAI_API_KEY: "k" }, fetcher }), []);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("latest Codex image is found under CODEX_HOME/generated_images", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "dreative-codex-"));
  try {
    assert.throws(() => latestCodexImage(home), /no Codex generated images/);
    const dir = path.join(home, "generated_images", "session-a");
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "old.png"), PNG);
    fs.utimesSync(path.join(dir, "old.png"), new Date(2000, 1, 1), new Date(2000, 1, 1));
    fs.writeFileSync(path.join(dir, "new.png"), PNG);
    assert.equal(path.basename(latestCodexImage(home)), "new.png");
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test("doctor recommends exact fixes for missing tools, keys, skills and motion packages", async () => {
  const root = project();
  try {
    fs.writeFileSync(path.join(root, "package.json"), JSON.stringify({ dependencies: { react: "^18", gsap: "^3" } }));
    fs.mkdirSync(path.join(root, "node_modules", "gsap"), { recursive: true });
    fs.writeFileSync(path.join(root, "node_modules", "gsap", "package.json"), "{}");
    placeShots(path.join(root, ".dreative", "shots.json"));
    const items = await runDoctor({ projectDir: root, env: {}, home: root, chromiumPath: async () => null,
      run: (cmd) => cmd === "codex" ? { status: 0, stdout: "image_generation   stable   true" } : { status: cmd === "ffmpeg" ? 0 : 1, stdout: "" } });
    const get = (id: string) => items.find((i) => i.id === id)!;
    assert.equal(get("chromium").ok, false);
    assert.equal(get("ffmpeg").ok, true);
    assert.equal(get("blender").ok, false);
    assert.equal(get("codex-image-gen").ok, true);
    assert.equal(get("image-api-key").ok, false);
    assert.equal(get("claude-skill").ok, false);
    assert.match(get("motion-packages").fix!, /^npm install lenis @gsap\/react$/);
    assert.match(get("shots").detail, /2 placeholder/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});
