import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

test("package remains a skill and CLI without the retired editor or design engine", () => {
  const root = process.cwd();
  const cli = fs.readFileSync(path.join(root, "src", "cli", "index.ts"), "utf8");
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

  assert.doesNotMatch(cli, /start-editor|createServer|\/api\/agent|\/api\/baseline/);
  assert.deepEqual(pkg.dependencies ?? {}, {});

  for (const retired of [
    "src/server/index.ts",
    "src/ui/App.tsx",
    "src/shared/design.ts",
    "src/shared/skillSystem.ts",
    "src/shared/types.ts",
    "vite.config.ts",
  ]) {
    assert.equal(fs.existsSync(path.join(root, retired)), false, `${retired} must remain retired`);
  }
});
