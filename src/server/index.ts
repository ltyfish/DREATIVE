import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { Store, findBlock, replaceBlock, newId } from "./store.js";
import { requestAgent, respond, nextEvent, pushFinish } from "./agentQueue.js";
import { computeDiff } from "./diff.js";
import { buildPreview, previewHtml, replicaHtml } from "./preview.js";
import { buildDesignPlan, buildDesignSourceContext, buildRuntimeCoherence } from "../shared/design.js";
import { startJob, getJob } from "./jobs.js";
import type { Block, Project } from "../shared/types.js";

type Proposal = { name: string; layout: Block; source?: string };

const here = path.dirname(fileURLToPath(import.meta.url));

function cloneWithNewIds(block: Block): Block {
  return {
    ...block,
    id: newId("blk"),
    children: block.children?.map(cloneWithNewIds),
  };
}

export function createServer(projectDir: string) {
  const store = new Store(projectDir);
  const app = express();
  app.use(express.json({ limit: "30mb" }));

  app.get("/api/project", (_req, res) => {
    res.json(store.load());
  });

  app.put("/api/project", (req, res) => {
    store.save(req.body as Project);
    res.json({ ok: true });
  });

  app.get("/api/jobs/:id", (req, res) => {
    const job = getJob(req.params.id);
    if (!job) return res.status(404).json({ error: "job not found" });
    res.json(job);
  });

  // ---- Host-agent bridge -------------------------------------------------
  // The coding CLI (dreative skill) long-polls for work and posts results.

  app.get("/api/agent/next", async (_req, res) => {
    const ev = await nextEvent(25_000);
    if (!ev) return res.status(204).end();
    res.json(ev);
  });

  app.post("/api/agent/respond", (req, res) => {
    const { id, result, error } = req.body as { id: string; result?: unknown; error?: string };
    if (!respond(id, { result, error })) return res.status(404).json({ error: "request not found" });
    res.json({ ok: true });
  });

  // Snapshot current project as diff baseline (agent calls this after extraction)
  app.post("/api/baseline", (_req, res) => {
    store.saveBaseline();
    res.json({ ok: true });
  });

  // Finish: compute layout diff vs baseline and hand it to the agent
  app.post("/api/finish", (_req, res) => {
    const baseline = store.loadBaseline() ?? { version: 1 as const, pages: [] };
    const diff = computeDiff(baseline, store.load());
    fs.writeFileSync(path.join(store.root, "finish.json"), JSON.stringify(diff, null, 2));
    pushFinish(diff);
    res.json({ ok: true, diff });
  });

  // Stage 1: prompt -> AI proposes skeleton pages placed on the canvas
  app.post("/api/skeletons", (req, res) => {
    const { prompt } = req.body as { prompt: string };
    const job = startJob("Proposing layouts", async (update) => {
      const proposals = await requestAgent<Proposal[]>(
        "propose-skeletons",
        { prompt, brief: store.load().brief },
        update,
      );
      return store.update((p) => {
        const baseX = Math.max(0, ...p.pages.map((pg) => pg.canvasPos.x + 480));
        proposals.forEach((prop, i) => {
          p.pages.push({
            id: newId("pg"),
            name: prop.name,
            canvasPos: { x: baseX + i * 480, y: 40 },
            status: "skeleton",
            layout: prop.layout,
          });
        });
      });
    });
    res.json({ jobId: job.id });
  });

  // AI variants of an existing page
  app.post("/api/pages/:pageId/variants", (req, res) => {
    const page = store.getPage(req.params.pageId);
    if (!page) return res.status(404).json({ error: "page not found" });
    const job = startJob(`Variants of ${page.name}`, async (update) => {
      const proposals = await requestAgent<Proposal[]>(
        "propose-variants",
        { pageName: page.name, layout: page.layout, brief: store.load().brief },
        update,
      );
      return store.update((p) => {
        proposals.forEach((prop, i) => {
          p.pages.push({
            id: newId("pg"),
            name: prop.name,
            canvasPos: { x: page.canvasPos.x + (i + 1) * 480, y: page.canvasPos.y + 60 },
            status: "skeleton",
            layout: prop.layout,
          });
        });
      });
    });
    res.json({ jobId: job.id });
  });

  // Duplicate a page (fresh block ids, no generated design)
  app.post("/api/pages/:pageId/duplicate", (req, res) => {
    const page = store.getPage(req.params.pageId);
    if (!page) return res.status(404).json({ error: "page not found" });
    const project = store.update((p) => {
      p.pages.push({
        id: newId("pg"),
        name: `${page.name} copy`,
        canvasPos: { x: page.canvasPos.x + 60, y: page.canvasPos.y + 60 },
        status: "skeleton",
        refImage: page.refImage,
        designPrompt: page.designPrompt,
        layout: cloneWithNewIds(page.layout),
      });
    });
    res.json(project);
  });

  // Stage 2: AI edit of a selected block (structure + functionality intents)
  app.post("/api/pages/:pageId/blocks/:blockId/edit", (req, res) => {
    const { pageId, blockId } = req.params;
    const { instruction } = req.body as { instruction: string };
    const page = store.getPage(pageId);
    if (!page) return res.status(404).json({ error: "page not found" });
    const block = findBlock(page.layout, blockId);
    if (!block) return res.status(404).json({ error: "block not found" });
    const job = startJob("Editing block", async (update) => {
      const updated = await requestAgent<Block>("edit-block", { block, instruction }, update);
      return store.update((p) => {
        const pg = p.pages.find((x) => x.id === pageId)!;
        pg.layout = replaceBlock(pg.layout, blockId, updated);
        if (pg.status === "designed") pg.status = "skeleton"; // design is stale
      });
    });
    res.json({ jobId: job.id });
  });

  // Block-level (or preview-element) ref image upload. Element ids in designed
  // pages are block ids, so this covers both. Returns the stored path.
  app.post("/api/pages/:pageId/blocks/:blockId/ref", (req, res) => {
    const { pageId, blockId } = req.params;
    const { name, dataBase64 } = req.body as { name: string; dataBase64: string };
    const ext = path.extname(name) || ".png";
    const fileName = `${pageId}_${blockId}${ext}`;
    fs.writeFileSync(store.refPath(fileName), Buffer.from(dataBase64, "base64"));
    const rel = `refs/${fileName}`;
    const project = store.update((p) => {
      const pg = p.pages.find((x) => x.id === pageId);
      const block = pg && findBlock(pg.layout, blockId);
      if (block) block.refImage = rel;
    });
    res.json({ ...project, refPath: rel });
  });

  // Ref image upload (JSON base64 keeps the client simple)
  app.post("/api/pages/:pageId/ref", (req, res) => {
    const { pageId } = req.params;
    const { name, dataBase64 } = req.body as { name: string; dataBase64: string };
    const ext = path.extname(name) || ".png";
    const fileName = `${pageId}${ext}`;
    fs.writeFileSync(store.refPath(fileName), Buffer.from(dataBase64, "base64"));
    const project = store.update((p) => {
      const pg = p.pages.find((x) => x.id === pageId);
      if (pg) pg.refImage = `refs/${fileName}`;
    });
    res.json(project);
  });

  // Design one page via the agent bridge; shared by single-page design and design-all.
  // Paths only (relative to .dreative/) — the agent reads images/previous
  // code with its own tools and writes the .tsx file itself.
  async function designPage(pageId: string, designPrompt: string | undefined, update: (detail: string) => void) {
    const project = store.load();
    const page = project.pages.find((p) => p.id === pageId);
    if (!page) throw new Error("page not found");
    const siblingPages = project.pages.filter((p) => p.id !== pageId).map((p) => p.name);
    const projectComposition = buildRuntimeCoherence(project.pages, project.brief);
    const blockRefs: { id: string; label: string; refImage: string }[] = [];
    const collect = (b: Block) => {
      if (b.refImage) blockRefs.push({ id: b.id, label: b.label, refImage: b.refImage });
      b.children?.forEach(collect);
    };
    collect(page.layout);
    const outFile = `generated/${pageId}.tsx`;
    const plan = buildDesignPlan(page, project.brief);
    const source = buildDesignSourceContext(plan.depth, page.generatedFile);
    await requestAgent(
      "design-page",
      {
        pageName: page.name,
        layout: page.layout,
        brief: project.brief,
        // Dreative resolves depth, source strategy, contracts, budgets, and
        // blocking lints; the agent authors the page-specific composition.
        plan,
        refImage: page.refImage,
        blockRefs,
        designPrompt: designPrompt ?? page.designPrompt,
        source,
        ...(source.previousFile ? { previousFile: source.previousFile } : {}),
        siblingPages,
        projectComposition,
        outFile,
      },
      update,
    );
    if (!fs.existsSync(path.join(store.root, outFile))) throw new Error(`agent did not write ${outFile}`);
    return store.update((p) => {
      const pg = p.pages.find((x) => x.id === pageId)!;
      pg.status = "designed";
      pg.generatedFile = outFile;
      pg.designPrompt = designPrompt ?? pg.designPrompt;
    });
  }

  // Stage 3: design pass (preserves prior element-level edits when regenerating)
  app.post("/api/pages/:pageId/design", (req, res) => {
    const { pageId } = req.params;
    const { designPrompt } = req.body as { designPrompt?: string };
    const page = store.getPage(pageId);
    if (!page) return res.status(404).json({ error: "page not found" });
    const job = startJob(`Designing ${page.name}`, (update) => designPage(pageId, designPrompt, update));
    res.json({ jobId: job.id });
  });

  // Design every page in one job (skips none — regenerates designed pages too if asked)
  app.post("/api/design-all", (req, res) => {
    const { onlySkeletons } = req.body as { onlySkeletons?: boolean };
    const pages = store.load().pages.filter((p) => !onlySkeletons || p.status === "skeleton");
    if (pages.length === 0) return res.status(400).json({ error: "no pages to design" });
    const job = startJob(`Designing ${pages.length} page(s)`, async (update) => {
      let project;
      for (let i = 0; i < pages.length; i++) {
        const scoped = (d: string) => update(`${pages[i].name} (${i + 1}/${pages.length}): ${d}`);
        project = await designPage(pages[i].id, undefined, scoped);
      }
      return project;
    });
    res.json({ jobId: job.id });
  });

  // Preview-mode element edit
  app.post("/api/pages/:pageId/element/:elementId/edit", (req, res) => {
    const { pageId, elementId } = req.params;
    const { instruction, refPath } = req.body as { instruction: string; refPath?: string };
    const page = store.getPage(pageId);
    if (!page?.generatedFile) return res.status(404).json({ error: "page not designed yet" });
    const job = startJob("Editing element", async (update) => {
      await requestAgent(
        "edit-element",
        { file: page.generatedFile, elementId, instruction, refImage: refPath },
        update,
      );
      return store.load();
    });
    res.json({ jobId: job.id });
  });

  // Export generated pages into the user's project
  app.post("/api/export", (req, res) => {
    const { dir } = req.body as { dir?: string };
    const target = path.resolve(projectDir, dir || "src/pages");
    fs.mkdirSync(target, { recursive: true });
    const exported: string[] = [];
    for (const page of store.load().pages) {
      if (!page.generatedFile) continue;
      const safe = page.name.replace(/[^a-zA-Z0-9]/g, "") || page.id;
      const dest = path.join(target, `${safe}.tsx`);
      const code = fs.readFileSync(path.join(store.root, page.generatedFile), "utf-8");
      fs.writeFileSync(dest, `// Generated by Dreative. Requires Tailwind CSS in the host project.\n${code}`);
      exported.push(dest);
    }
    res.json({ exported });
  });

  // Preview serving
  app.get("/preview/:pageId", (req, res) => {
    res.type("html").send(previewHtml(`/preview/${req.params.pageId}/bundle.js?t=${Date.now()}`));
  });

  app.get("/preview/:pageId/bundle.js", async (req, res) => {
    try {
      const page = store.getPage(req.params.pageId);
      if (!page?.generatedFile) return res.status(404).send("// not designed yet");
      const js = await buildPreview(path.join(store.root, page.generatedFile));
      res.type("application/javascript").send(js);
    } catch (err) {
      const msg = JSON.stringify(`Preview build error:\n${String(err)}`);
      res
        .type("application/javascript")
        .send(`const pre=document.createElement("pre");pre.style.cssText="color:red;padding:16px;white-space:pre-wrap";pre.textContent=${msg};document.body.appendChild(pre);`);
      console.error("preview build failed:", err);
    }
  });

  // Replica serving: stripped 1:1 copy of the real page, hover = agent summaries
  app.get("/replica/:pageId", (req, res) => {
    const page = store.getPage(req.params.pageId);
    if (!page?.replicaFile) return res.status(404).send("no replica for this page");
    const summaries: Record<string, string> = {};
    const collect = (b: Block) => {
      if (b.summary) summaries[b.id] = b.summary;
      b.children?.forEach(collect);
    };
    collect(page.layout);
    res.type("html").send(replicaHtml(`/replica/${req.params.pageId}/bundle.js?t=${Date.now()}`, summaries));
  });

  app.get("/replica/:pageId/bundle.js", async (req, res) => {
    try {
      const page = store.getPage(req.params.pageId);
      if (!page?.replicaFile) return res.status(404).send("// no replica");
      const js = await buildPreview(path.join(store.root, page.replicaFile));
      res.type("application/javascript").send(js);
    } catch (err) {
      const msg = JSON.stringify(`Replica build error:\n${String(err)}`);
      res
        .type("application/javascript")
        .send(`const pre=document.createElement("pre");pre.style.cssText="color:red;padding:16px;white-space:pre-wrap";pre.textContent=${msg};document.body.appendChild(pre);`);
      console.error("replica build failed:", err);
    }
  });

  app.use("/refs", express.static(path.join(store.root, "refs")));

  // Built UI (production / npx usage)
  const uiDist = path.join(here, "..", "ui");
  if (fs.existsSync(uiDist)) {
    app.use(express.static(uiDist));
    app.get("*", (_req, res) => res.sendFile(path.join(uiDist, "index.html")));
  }

  return app;
}
