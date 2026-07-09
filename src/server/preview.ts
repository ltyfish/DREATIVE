import esbuild from "esbuild";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
// Resolve react from dreative's own install, not the user's project.
const packageRoot = path.resolve(here, "..", "..");

/** Bundle a generated page component + mount shim into one iframe-ready JS file. */
export async function buildPreview(generatedFile: string): Promise<string> {
  const entry = `
    import React from "react";
    import { createRoot } from "react-dom/client";
    import Page from ${JSON.stringify(generatedFile.replace(/\\/g, "/"))};
    createRoot(document.getElementById("root")).render(React.createElement(Page));
  `;
  const result = await esbuild.build({
    stdin: {
      contents: entry,
      resolveDir: packageRoot,
      loader: "tsx",
    },
    bundle: true,
    write: false,
    format: "iife",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    loader: { ".tsx": "tsx", ".ts": "ts" },
    nodePaths: [path.join(packageRoot, "node_modules")],
  });
  return result.outputFiles[0].text;
}

export function previewHtml(scriptUrl: string): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body{margin:0}</style>
</head>
<body>
  <div id="root"></div>
  <script>
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-dreative-id]");
      if (!el) return;
      e.preventDefault();
      parent.postMessage({ type: "dreative-select", id: el.getAttribute("data-dreative-id") }, "*");
    }, true);
    document.addEventListener("mouseover", (e) => {
      document.querySelectorAll(".dreative-hover").forEach(n => n.classList.remove("dreative-hover"));
      const el = e.target.closest("[data-dreative-id]");
      if (el) el.classList.add("dreative-hover");
    });
  </script>
  <style>.dreative-hover{outline:2px dashed #6366f1;outline-offset:-2px;cursor:pointer}</style>
  <script src="${scriptUrl}"></script>
</body>
</html>`;
}

/** Replica view: 1:1 stripped page. Interactions are inert; hover shows the
 *  agent-written summary of what each element does; click selects the block. */
export function replicaHtml(scriptUrl: string, summaries: Record<string, string>): string {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body{margin:0}
    .dreative-hover{outline:2px dashed #6366f1;outline-offset:-2px;cursor:pointer}
    #dreative-tip{position:fixed;z-index:99999;max-width:340px;background:#16181f;color:#e8e8ea;border:1px solid #2c2f3a;border-radius:8px;padding:8px 10px;font:12px/1.45 ui-sans-serif,system-ui;pointer-events:none;display:none;box-shadow:0 8px 24px rgba(0,0,0,.4)}
    #dreative-tip b{color:#a5b4fc}
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="dreative-tip"></div>
  <script>
    const SUMMARIES = ${JSON.stringify(summaries)};
    // replica is a mockup: block navigation/submits, keep selection working
    document.addEventListener("click", (e) => {
      e.preventDefault();
      const el = e.target.closest("[data-dreative-id]");
      if (el) parent.postMessage({ type: "dreative-select-block", id: el.getAttribute("data-dreative-id") }, "*");
    }, true);
    document.addEventListener("submit", (e) => e.preventDefault(), true);
    const tip = document.getElementById("dreative-tip");
    document.addEventListener("mousemove", (e) => {
      if (tip.style.display === "block") {
        tip.style.left = Math.min(e.clientX + 14, innerWidth - 360) + "px";
        tip.style.top = Math.min(e.clientY + 14, innerHeight - 80) + "px";
      }
    });
    document.addEventListener("mouseover", (e) => {
      document.querySelectorAll(".dreative-hover").forEach(n => n.classList.remove("dreative-hover"));
      const el = e.target.closest("[data-dreative-id]");
      if (!el) { tip.style.display = "none"; return; }
      el.classList.add("dreative-hover");
      const id = el.getAttribute("data-dreative-id");
      const s = SUMMARIES[id];
      if (s) { tip.innerHTML = "<b>" + id + "</b><br>" + s.replace(/</g, "&lt;"); tip.style.display = "block"; }
      else tip.style.display = "none";
    });
  </script>
  <script src="${scriptUrl}"></script>
</body>
</html>`;
}

export function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}
