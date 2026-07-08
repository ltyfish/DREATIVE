#!/usr/bin/env node
import { createServer } from "../server/index.js";
import open from "open";

const port = Number(process.env.DREATIVE_PORT || 4820);
const noOpen = process.argv.includes("--no-open");
const projectDir = process.cwd();

const app = createServer(projectDir);
app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`\n  Dreative running for ${projectDir}`);
  console.log(`  ${url}\n`);
  if (!noOpen) open(url).catch(() => {});
});
