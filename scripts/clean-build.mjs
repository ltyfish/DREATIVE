import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const directory of ["cli", "shared", "server", "ui"]) {
  fs.rmSync(path.join(root, "dist", directory), { recursive: true, force: true });
}
