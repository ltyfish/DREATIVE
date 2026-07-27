import fs from "node:fs";

export type ExperienceMapDirection = "efficient" | "recommended" | "showcase";
export type ExperienceOverride = "recommended" | "more-animated" | "calmer" | "change-layout" | "change-interaction" | "keep-static";

export interface ExperienceSection {
  id: string;
  title: string;
  role: string;
  intensity: 1 | 2 | 3 | 4 | 5;
  inputState: string;
  startState: string;
  endState: string;
  mechanismOwner: string;
  connection: string;
  desktop: string;
  mobile: string;
  reducedMotion: string;
  evidenceTarget: string;
  override?: ExperienceOverride;
  instruction?: string;
}

export interface ExperienceMap {
  version: 1;
  direction: ExperienceMapDirection;
  route: string;
  concept: string;
  primaryPeak: string;
  recommendations: string[];
  sections: ExperienceSection[];
}

const text = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
const DIRECTIONS = new Set(["efficient", "recommended", "showcase"]);
const OVERRIDES = new Set(["recommended", "more-animated", "calmer", "change-layout", "change-interaction", "keep-static"]);

export function validateExperienceMap(value: unknown): string[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["experience map must be a JSON object"];
  const map = value as Record<string, unknown>;
  const errors: string[] = [];
  if (map.version !== 1) errors.push("version must be 1");
  if (!DIRECTIONS.has(String(map.direction))) errors.push("direction must be efficient, recommended, or showcase");
  for (const key of ["route", "concept", "primaryPeak"]) if (!text(map[key])) errors.push(`${key} must be a non-empty string`);
  if (!Array.isArray(map.recommendations) || map.recommendations.length < 1 || map.recommendations.length > 3 || map.recommendations.some((item) => !text(item)))
    errors.push("recommendations must contain one to three concrete suggestions");
  if (!Array.isArray(map.sections) || map.sections.length < 2) {
    errors.push("sections must contain at least two route sections");
    return errors;
  }
  const ids = new Set<string>();
  for (const [index, raw] of map.sections.entries()) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      errors.push(`sections[${index}] must be an object`);
      continue;
    }
    const section = raw as Record<string, unknown>;
    const prefix = `sections[${index}]`;
    for (const key of ["id", "title", "role", "inputState", "startState", "endState", "mechanismOwner", "connection", "desktop", "mobile", "reducedMotion", "evidenceTarget"])
      if (!text(section[key])) errors.push(`${prefix}.${key} must be a non-empty string`);
    if (!Number.isInteger(section.intensity) || Number(section.intensity) < 1 || Number(section.intensity) > 5)
      errors.push(`${prefix}.intensity must be an integer from 1 to 5`);
    if (text(section.id)) {
      if (ids.has(section.id)) errors.push(`${prefix}.id must be unique`);
      ids.add(section.id);
    }
    if (section.override !== undefined && !OVERRIDES.has(String(section.override))) errors.push(`${prefix}.override is invalid`);
    if (section.instruction !== undefined && typeof section.instruction !== "string") errors.push(`${prefix}.instruction must be a string`);
  }
  if (text(map.primaryPeak) && !ids.has(map.primaryPeak)) errors.push("primaryPeak must match a section id");
  return errors;
}

export function readExperienceMap(file: string): ExperienceMap {
  const parsed: unknown = JSON.parse(fs.readFileSync(file, "utf8"));
  const errors = validateExperienceMap(parsed);
  if (errors.length) throw new Error(errors.join("\n"));
  return parsed as ExperienceMap;
}

export function renderExperienceMap(map: ExperienceMap): string {
  const width = Math.max(7, ...map.sections.map((section) => section.title.length));
  const rows = map.sections.map((section) => {
    const choice = section.override && section.override !== "recommended" ? `; user change: ${section.override}` : "";
    return `${section.title.padEnd(width)}  ${section.intensity}/5  ${section.role} — ${section.connection}${choice}`;
  });
  return [
    `Experience Map — ${map.route}`,
    `Concept: ${map.concept}`,
    "",
    ...rows,
    "",
    "Dreative recommends:",
    ...map.recommendations.map((item) => `- ${item}`),
    "",
    "Reply “use Dreative’s recommended approach” or name section changes: more animated, calmer, change layout, change interaction, keep static, or add an instruction.",
  ].join("\n");
}

export function renderImplementationObligations(map: ExperienceMap): string {
  return map.sections.map((section) => [
    `${section.title} [${section.id}]`,
    `  Role/input: ${section.role} / ${section.inputState}`,
    `  Visible change: ${section.startState} → ${section.endState}`,
    `  Owner/handoff: ${section.mechanismOwner} / ${section.connection}`,
    `  Desktop/mobile/reduced: ${section.desktop} / ${section.mobile} / ${section.reducedMotion}`,
    `  Evidence: ${section.evidenceTarget}`,
  ].join("\n")).join("\n\n");
}

export function journeyBalanceAdvisories(map: ExperienceMap): string[] {
  const peak = map.sections.find((section) => section.id === map.primaryPeak);
  if (!peak) return [];
  const total = map.sections.reduce((sum, section) => sum + section.intensity, 0);
  const developedOutsidePeak = map.sections.filter((section) =>
    section.id !== peak.id && section.intensity >= 3 && section.override !== "keep-static");
  const advisories: string[] = [];
  if (peak.intensity / total >= 0.5 || developedOutsidePeak.length === 0)
    advisories.push(`The primary peak “${peak.title}” may carry most of the experiential weight; inspect a meaningful development or consequence elsewhere.`);
  const afterPeak = map.sections.slice(map.sections.indexOf(peak) + 1);
  if (afterPeak.length && !afterPeak.some((section) => section.intensity >= 3 && section.override !== "keep-static"))
    advisories.push("Everything after the primary peak is low-intensity; verify that the journey resolves rather than simply returning to ordinary sections.");
  return advisories;
}
