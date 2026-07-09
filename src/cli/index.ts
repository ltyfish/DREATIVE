#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";
import { createServer } from "../server/index.js";
import open from "open";

const port = Number(process.env.DREATIVE_PORT || 4820);
const base = `http://localhost:${port}`;
const args = process.argv.slice(2);
const cmd = args[0] && !args[0].startsWith("-") ? args[0] : "start";

const USAGE = `usage: dreative [command]
  start            serve the visual editor for the current project (default)
  install-skill    copy the dreative skill into ./.claude/skills/dreative/
                   --list             show available specialist skills
                   --skills a,b       install only these specialist skills (no flag: interactive picker, Enter = all)
                   --codex            install for Codex CLI instead (.codex/skills/ + AGENTS.md pointer)
  wait             (agent) block until the UI needs something; prints one JSON event
  respond <id> [result.json | --error msg]   (agent) answer a request
  baseline         (agent) snapshot project.json as the finish-diff baseline`;

async function main() {
  if (args.includes("--help") || args.includes("-h")) {
    console.log(USAGE);
    return;
  }
  switch (cmd) {
    case "start": {
      const app = createServer(process.cwd());
      const server = app.listen(port, () => {
        console.log(`\n  Dreative running for ${process.cwd()}`);
        console.log(`  ${base}\n`);
        if (!args.includes("--no-open")) open(base).catch(() => {});
      });
      server.on("error", (err) => {
        console.error(`failed to start on :${port} — ${String(err)}\n(set DREATIVE_PORT to use another port)`);
        process.exit(1);
      });
      return;
    }

    case "install-skill": {
      const srcDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "skill", "dreative");
      const skillsDir = path.join(srcDir, "skills");
      const available = fs.existsSync(skillsDir)
        ? fs.readdirSync(skillsDir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""))
        : [];

      if (args.includes("--list")) {
        console.log(`specialist skills (installed by default, pick with --skills a,b):`);
        for (const s of available) {
          const firstLine = fs.readFileSync(path.join(skillsDir, `${s}.md`), "utf-8").split("\n")[0].replace(/^#\s*/, "");
          console.log(`  ${s.padEnd(14)} ${firstLine}`);
        }
        return;
      }

      const sArg = args.indexOf("--skills");
      let picked = available;
      if (sArg > -1) {
        picked = (args[sArg + 1] || "").split(",").map((t) => t.trim()).filter(Boolean);
        const unknown = picked.filter((p) => !available.includes(p));
        if (unknown.length) throw new Error(`unknown skill(s): ${unknown.join(", ")} — available: ${available.join(", ")}`);
      } else if (process.stdin.isTTY && available.length) {
        console.log("specialist skills:");
        available.forEach((s, i) => {
          const firstLine = fs.readFileSync(path.join(skillsDir, `${s}.md`), "utf-8").split("\n")[0].replace(/^#\s*/, "");
          console.log(`  ${i + 1}. ${s.padEnd(14)} ${firstLine}`);
        });
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const answer = (await new Promise<string>((res) => rl.question("install which? (numbers/names, comma-separated; Enter = all): ", res))).trim();
        rl.close();
        if (answer && answer.toLowerCase() !== "all") {
          picked = answer.split(",").map((t) => t.trim()).filter(Boolean).map((t) => {
            const n = Number(t);
            return Number.isInteger(n) && n >= 1 && n <= available.length ? available[n - 1] : t;
          });
          const unknown = picked.filter((p) => !available.includes(p));
          if (unknown.length) throw new Error(`unknown skill(s): ${unknown.join(", ")} — available: ${available.join(", ")}`);
        }
      }

      const forCodex = args.includes("--codex");
      const destDir = forCodex
        ? path.join(process.cwd(), ".codex", "skills", "dreative")
        : path.join(process.cwd(), ".claude", "skills", "dreative");
      fs.mkdirSync(destDir, { recursive: true });
      for (const f of fs.readdirSync(srcDir)) {
        if (fs.statSync(path.join(srcDir, f)).isFile()) fs.copyFileSync(path.join(srcDir, f), path.join(destDir, f));
      }
      if (picked.length) {
        fs.mkdirSync(path.join(destDir, "skills"), { recursive: true });
        for (const s of picked) {
          fs.copyFileSync(path.join(skillsDir, `${s}.md`), path.join(destDir, "skills", `${s}.md`));
        }
      }
      if (forCodex) {
        // Codex may not auto-discover skills — leave a pointer in AGENTS.md (idempotent).
        const agentsMd = path.join(process.cwd(), "AGENTS.md");
        const marker = "<!-- dreative-skill -->";
        const pointer = `\n${marker}\n## Dreative (frontend design skill)\nFor ANY frontend design work (redesign, restyle, build pages, animations, motion, 3D, micro-interactions) or when the user says "open dreative" / wants to edit the UI visually: read \`.codex/skills/dreative/SKILL.md\` first and follow it.\n`;
        const existing = fs.existsSync(agentsMd) ? fs.readFileSync(agentsMd, "utf-8") : "";
        if (!existing.includes(marker)) fs.writeFileSync(agentsMd, existing + pointer);
      }
      console.log(`installed skill to ${destDir}${forCodex ? " (Codex mode: AGENTS.md pointer added)" : ""}`);
      console.log(`  core: SKILL.md, DESIGN.md`);
      console.log(`  specialist skills: ${picked.length ? picked.join(", ") : "(none)"}`);
      console.log(`next: ask your coding agent to "open dreative" or "redesign my app's UI visually"`);
      return;
    }

    // Agent: block until the UI needs something; print one event as JSON.
    // Output: {"kind":"request",...} | {"kind":"finish","diff":...} | {"kind":"none"}
    case "wait": {
      const tArg = args.indexOf("--timeout");
      const timeoutMs = (tArg > -1 ? Number(args[tArg + 1]) : 480) * 1000;
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        const res = await fetch(`${base}/api/agent/next`);
        if (res.status === 204) continue; // server long-polls 25s per round
        if (!res.ok) throw new Error(`server error ${res.status}`);
        console.log(JSON.stringify(await res.json()));
        return;
      }
      console.log(JSON.stringify({ kind: "none" }));
      return;
    }

    // Agent: answer a request. `dreative respond <id> <result.json>` or --error "msg"
    case "respond": {
      const id = args[1];
      if (!id) throw new Error("usage: dreative respond <requestId> [resultFile] [--error msg]");
      const eArg = args.indexOf("--error");
      const body: { id: string; result?: unknown; error?: string } = { id };
      if (eArg > -1) body.error = args[eArg + 1] || "agent error";
      else if (args[2]) body.result = JSON.parse(fs.readFileSync(args[2], "utf-8"));
      else body.result = { ok: true };
      const res = await fetch(`${base}/api/agent/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`respond failed: ${await res.text()}`);
      console.log("ok");
      return;
    }

    // Agent: snapshot current project.json as the finish-diff baseline
    case "baseline": {
      const res = await fetch(`${base}/api/baseline`, { method: "POST" });
      if (!res.ok) throw new Error(`baseline failed: ${await res.text()}`);
      console.log("ok");
      return;
    }

    default:
      console.error(`unknown command: ${cmd}\n${USAGE}`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(String(err));
  process.exit(1);
});
