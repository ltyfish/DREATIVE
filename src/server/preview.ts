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

export function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}
