import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { probeMedia } from "./media.js";
import { shotStatus } from "./shots.js";

// Reports what a Dreative design session can use on this machine and in this project, with the
// exact command for anything missing. `--fix` installs project packages and the browser only;
// machine software is printed for the user (or agent, when authorized) to install.

export interface DoctorItem { area: "machine" | "host" | "project"; id: string; ok: boolean; required: boolean; detail: string; fix?: string }
type Run = (cmd: string, args: string[]) => { status: number | null; stdout: string };

const defaultRun: Run = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: "utf8", windowsHide: true, timeout: 20_000, shell: process.platform === "win32" });
  return { status: r.status, stdout: `${r.stdout ?? ""}${r.stderr ?? ""}` };
};

function installHint(tool: "ffmpeg" | "magick" | "blender" | "gltf"): string {
  const win = { ffmpeg: "winget install Gyan.FFmpeg", magick: "winget install ImageMagick.ImageMagick", blender: "winget install BlenderFoundation.Blender", gltf: "npm i -g @gltf-transform/cli" };
  const mac = { ffmpeg: "brew install ffmpeg", magick: "brew install imagemagick", blender: "brew install --cask blender", gltf: "npm i -g @gltf-transform/cli" };
  const linux = { ffmpeg: "sudo apt install ffmpeg", magick: "sudo apt install imagemagick", blender: "sudo snap install blender --classic", gltf: "npm i -g @gltf-transform/cli" };
  return (process.platform === "win32" ? win : process.platform === "darwin" ? mac : linux)[tool];
}

export function packageManager(dir: string): "pnpm" | "yarn" | "bun" | "npm" {
  if (fs.existsSync(path.join(dir, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(dir, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(dir, "bun.lockb")) || fs.existsSync(path.join(dir, "bun.lock"))) return "bun";
  return "npm";
}
const addCommand = (pm: string, pkgs: string[]) => `${pm} ${pm === "npm" ? "install" : "add"} ${pkgs.join(" ")}`;

export async function runDoctor(options: { projectDir: string; env?: Record<string, string | undefined>; run?: Run; home?: string; chromiumPath?: () => Promise<string | null> }): Promise<DoctorItem[]> {
  const env = options.env ?? process.env, run = options.run ?? defaultRun, home = options.home ?? os.homedir();
  const items: DoctorItem[] = [];
  const add = (item: DoctorItem) => items.push(item);

  // machine
  const major = Number(process.versions.node.split(".")[0]);
  add({ area: "machine", id: "node", ok: major >= 20, required: true, detail: `node ${process.versions.node}`, fix: "install Node.js 20+" });
  const chromium = await (options.chromiumPath ?? (async () => {
    try { const { chromium } = await import("@playwright/test"); const p = chromium.executablePath(); return fs.existsSync(p) ? p : null; } catch { return null; }
  }))();
  add({ area: "machine", id: "chromium", ok: Boolean(chromium), required: true, detail: chromium ? "Playwright Chromium for look/motion-capture/finalize" : "missing — look, motion-capture and finalize need it", fix: "npx playwright install chromium" });
  const tool = (id: string, cmd: string, args: string[], required: boolean, purpose: string, fix: string) => {
    const ok = run(cmd, args).status === 0;
    add({ area: "machine", id, ok, required, detail: ok ? purpose : `missing — ${purpose}`, fix });
  };
  tool("ffmpeg", "ffmpeg", ["-version"], false, "video posters, frame sequences, contact sheets (media-inspect)", installHint("ffmpeg"));
  tool("imagemagick", "magick", ["-version"], false, "resize, crop, grade and convert image sets", installHint("magick"));
  tool("blender", "blender", ["--version"], false, "render models to consistent views and frame sequences", installHint("blender"));
  tool("gltf-transform", "gltf-transform", ["--version"], false, "compress/optimise glTF models for the web", installHint("gltf"));

  // host image generation
  const codex = run("codex", ["features", "list"]);
  const codexImage = codex.status === 0 && /image_generation\s+\S+\s+true/.test(codex.stdout);
  add({ area: "host", id: "codex-image-gen", ok: codexImage, required: false,
    detail: codex.status !== 0 ? "Codex CLI not found" : codexImage ? "Codex built-in image_gen is enabled" : "Codex image_generation feature is off",
    fix: codex.status !== 0 ? "npm i -g @openai/codex" : "codex features enable image_generation (or -c features.image_generation=true)" });
  const media = probeMedia(env, (cmd, args) => run(cmd, args).status === 0);
  const keyed = media.generators.filter((g) => g.ready && g.id !== "pollinations").map((g) => g.id);
  add({ area: "host", id: "image-api-key", ok: keyed.length > 0, required: false,
    detail: keyed.length ? `keyed generation: ${keyed.join(", ")}` : "no generator key — Claude Code builds with placeholders until shots are filled",
    fix: "set OPENAI_API_KEY or GEMINI_API_KEY (or FAL_KEY / REPLICATE_API_TOKEN) in the environment that launches the agent" });
  const photo = media.photoSources.filter((s) => s.ready && s.id !== "openverse").map((s) => s.id);
  add({ area: "host", id: "photo-api-key", ok: photo.length > 0, required: false, detail: photo.length ? `photo search: openverse, ${photo.join(", ")}` : "photo search: openverse only (keyless)", fix: "set PEXELS_API_KEY / UNSPLASH_ACCESS_KEY / PIXABAY_API_KEY for wider stock search" });
  for (const host of ["claude", "codex"] as const) {
    const user = path.join(home, `.${host}`, "skills", "dreative", "SKILL.md");
    const project = path.join(options.projectDir, `.${host}`, "skills", "dreative", "SKILL.md");
    const ok = fs.existsSync(user) || fs.existsSync(project);
    add({ area: "host", id: `${host}-skill`, ok, required: false, detail: ok ? `installed (${fs.existsSync(project) ? "project" : "user"})` : "Dreative skill not installed for this host", fix: `dreative install-skill --skills all --${host} --global` });
  }

  // project
  const pkgFile = path.join(options.projectDir, "package.json");
  if (fs.existsSync(pkgFile)) {
    const pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies } as Record<string, string>;
    const pm = packageManager(options.projectDir);
    const installed = (name: string) => Boolean(deps[name]) && fs.existsSync(path.join(options.projectDir, "node_modules", ...name.split("/"), "package.json"));
    const wanted = ["gsap", "lenis", ...(deps.react ? ["@gsap/react"] : [])];
    const missing = wanted.filter((name) => !installed(name));
    add({ area: "project", id: "motion-packages", ok: !missing.length, required: true,
      detail: missing.length ? `missing ${missing.join(", ")} (motion recipes R0–R10)` : `${wanted.join(", ")} installed`, fix: addCommand(pm, missing) });
    const shots = path.join(options.projectDir, ".dreative", "shots.json");
    if (fs.existsSync(shots)) {
      try {
        const { open, rows } = shotStatus(shots);
        add({ area: "project", id: "shots", ok: open === 0, required: false, detail: `${rows.length - open}/${rows.length} shots have real images${open ? `; ${open} placeholder/missing` : ""}`, fix: "dreative media fill --shots .dreative/shots.json (key) or Codex image_gen + dreative media import" });
      } catch (error) { add({ area: "project", id: "shots", ok: false, required: false, detail: (error as Error).message }); }
    }
  }
  return items;
}

export function renderDoctor(items: DoctorItem[]): string {
  const lines: string[] = [];
  for (const area of ["machine", "host", "project"] as const) {
    const group = items.filter((i) => i.area === area);
    if (!group.length) continue;
    lines.push(`${area}:`);
    for (const i of group) lines.push(`  ${i.ok ? "ok     " : i.required ? "MISSING" : "missing"} ${i.id.padEnd(17)} ${i.detail}${!i.ok && i.fix ? `\n          → ${i.fix}` : ""}`);
  }
  const todo = items.filter((i) => !i.ok && i.fix);
  lines.push("", todo.length ? `Recommend to the user (${todo.length}): ${todo.map((i) => i.id).join(", ")}. Run \`dreative doctor --fix\` for project packages and the browser.` : "Everything Dreative uses is available.");
  return lines.join("\n");
}

export function fixDoctor(items: DoctorItem[], projectDir: string): string[] {
  const done: string[] = [];
  for (const item of items.filter((i) => !i.ok && (i.id === "motion-packages" || i.id === "chromium") && i.fix)) {
    const [cmd, ...args] = item.fix!.split(" ");
    const result = spawnSync(cmd, args, { cwd: item.id === "motion-packages" ? projectDir : undefined, stdio: "inherit", shell: process.platform === "win32" });
    done.push(`${result.status === 0 ? "installed" : "FAILED"}: ${item.fix}`);
  }
  return done;
}
