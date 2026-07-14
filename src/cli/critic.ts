import fs from "node:fs";
import path from "node:path";
import { buildIndependentCriticPrompt, validateCriticInput, type CriticInput } from "../shared/critic.js";

export function renderCriticPrompt(projectDir: string, inputFile = ".dreative/critic-input.json"): string {
  const absolute = path.resolve(projectDir, inputFile);
  if (!absolute.startsWith(path.resolve(projectDir) + path.sep)) throw new Error("critic input path escapes the project root");
  if (!fs.existsSync(absolute)) throw new Error(`missing critic input: ${inputFile}`);
  const input = JSON.parse(fs.readFileSync(absolute, "utf-8")) as CriticInput;
  const errors = validateCriticInput(input);
  if (errors.length) throw new Error(errors.join("\n"));
  return buildIndependentCriticPrompt(input);
}
