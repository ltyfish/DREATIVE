import fs from "node:fs";
import path from "node:path";
import { buildIndependentCriticPrompt, validateCriticInput, type CriticArtifact, type CriticInput } from "../shared/critic.js";

export function renderCriticPrompt(projectDir: string, inputFile = ".dreative/critic.json"): string {
  let absolute = path.resolve(projectDir, inputFile);
  if (inputFile === ".dreative/critic.json" && !fs.existsSync(absolute)) absolute = path.resolve(projectDir, ".dreative/critic-input.json");
  if (!absolute.startsWith(path.resolve(projectDir) + path.sep)) throw new Error("critic input path escapes the project root");
  if (!fs.existsSync(absolute)) throw new Error(`missing critic input: ${inputFile}`);
  const parsed = JSON.parse(fs.readFileSync(absolute, "utf-8")) as CriticInput | CriticArtifact;
  const input = "input" in parsed ? parsed.input : parsed;
  const errors = validateCriticInput(input);
  if (errors.length) throw new Error(errors.join("\n"));
  return buildIndependentCriticPrompt(input);
}
