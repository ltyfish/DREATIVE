import fs from "node:fs";
import path from "node:path";
import type { Project, Page, Block } from "../shared/types.js";

export class Store {
  readonly root: string;

  constructor(projectDir: string) {
    this.root = path.join(projectDir, ".dreative");
    fs.mkdirSync(path.join(this.root, "refs"), { recursive: true });
    fs.mkdirSync(path.join(this.root, "generated"), { recursive: true });
    const readme = path.join(this.root, "README.md");
    if (!fs.existsSync(readme)) {
      fs.writeFileSync(
        readme,
        "# Dreative run artifacts — NOT the skill\n\n" +
          "Everything in this folder (plan.yaml, critic.json, verify.json,\n" +
          "project.json, optional audit artifacts, and evidence) is OUTPUT of a Dreative design run,\n" +
          "not instructions. The actual skill lives at\n" +
          "`<agent-dir>/skills/dreative/SKILL.md` (look in `.claude/`, `.codex/`, or\n" +
          "`.agents/`). For any new design request: read that SKILL.md and run its\n" +
          "protocol from the start — these artifacts are the previous run's history,\n" +
          "never proof the new request is already done.\n"
      );
    }
  }

  private get file() {
    return path.join(this.root, "project.json");
  }

  load(): Project {
    if (!fs.existsSync(this.file)) return { version: 1, pages: [] };
    return JSON.parse(fs.readFileSync(this.file, "utf-8")) as Project;
  }

  save(project: Project) {
    fs.writeFileSync(this.file, JSON.stringify(project, null, 2));
  }

  update(fn: (p: Project) => void): Project {
    const project = this.load();
    fn(project);
    this.save(project);
    return project;
  }

  private get baselineFile() {
    return path.join(this.root, "baseline.json");
  }

  /** Snapshot the current project as the diff baseline (taken after extraction). */
  saveBaseline() {
    fs.writeFileSync(this.baselineFile, JSON.stringify(this.load(), null, 2));
  }

  loadBaseline(): Project | undefined {
    if (!fs.existsSync(this.baselineFile)) return undefined;
    return JSON.parse(fs.readFileSync(this.baselineFile, "utf-8")) as Project;
  }

  getPage(pageId: string): Page | undefined {
    return this.load().pages.find((p) => p.id === pageId);
  }

  refPath(fileName: string) {
    return path.join(this.root, "refs", fileName);
  }

  generatedPath(fileName: string) {
    return path.join(this.root, "generated", fileName);
  }
}

export function findBlock(root: Block, id: string): Block | undefined {
  if (root.id === id) return root;
  for (const child of root.children ?? []) {
    const found = findBlock(child, id);
    if (found) return found;
  }
  return undefined;
}

export function replaceBlock(root: Block, id: string, replacement: Block): Block {
  if (root.id === id) return replacement;
  return {
    ...root,
    children: root.children?.map((c) => replaceBlock(c, id, replacement)),
  };
}

let counter = 0;
export function newId(prefix: string) {
  counter += 1;
  return `${prefix}_${Date.now().toString(36)}${counter}`;
}
