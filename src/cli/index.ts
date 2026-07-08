#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "../server/index.js";
import open from "open";

const port = Number(process.env.DREATIVE_PORT || 4820);
const base = `http://localhost:${port}`;
const args = process.argv.slice(2);
const cmd = args[0] && !args[0].startsWith("-") ? args[0] : "start";

const USAGE = `usage: dreative [command]
  start            serve the visual editor for the current project (default)
  install-skill    copy the dreative skill into ./.claude/skills/dreative/
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
      const src = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "skill", "dreative", "SKILL.md");
      const destDir = path.join(process.cwd(), ".claude", "skills", "dreative");
      fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(src, path.join(destDir, "SKILL.md"));
      console.log(`installed skill to ${path.join(destDir, "SKILL.md")}`);
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
