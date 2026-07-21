export type SpecialistSkill =
  | "ux" | "mobile" | "refined" | "motion" | "interaction"
  | "media" | "3d" | "immersive" | "cinematic" | "experimental";

export type CreativeRisk = "low" | "medium" | "high";

export interface PackageProfile {
  id: string;
  packageName: string;
  importForm: string;
  useWhen: string;
  rejectWhen: string;
  cleanup: string[];
  optional: boolean;
  buildTimeOnly?: boolean;
}

const profile = (
  id: string,
  packageName: string,
  importForm: string,
  useWhen: string,
  rejectWhen: string,
  options: Partial<PackageProfile> = {},
): PackageProfile => ({
  id, packageName, importForm, useWhen, rejectWhen,
  cleanup: ["remove owned listeners, observers, tickers, and resources"],
  optional: true,
  ...options,
});

export const PACKAGE_PROFILES: PackageProfile[] = [
  profile("motion", "motion", `import { animate } from "motion"`, "animation follows component state, layout, enter/exit, hover, press, or drag", "the page needs a coordinated multi-system timeline"),
  profile("gsap", "gsap", `import { gsap } from "gsap"`, "a reversible or coordinated timeline owns several DOM/SVG states", "a CSS transition or component-state animation is sufficient"),
  profile("gsap-react", "@gsap/react", `import { useGSAP } from "@gsap/react"`, "GSAP runs inside React and must be scoped to a component", "the project is not React", { cleanup: ["scope with useGSAP and revert on unmount"] }),
  profile("gsap-scrolltrigger", "gsap", `import { ScrollTrigger } from "gsap/ScrollTrigger"`, "measured pinning or scrubbed choreography is central", "ordinary sticky positioning and native scroll progress are sufficient"),
  profile("gsap-flip", "gsap", `import { Flip } from "gsap/Flip"`, "one semantic subject must move between layouts", "a crossfade communicates the state change"),
  profile("gsap-splittext", "gsap", `import { SplitText } from "gsap/SplitText"`, "semantic typography needs measured word or glyph choreography", "type movement is decorative or harms reading order"),
  profile("lenis", "lenis", `import Lenis from "lenis"`, "velocity or DOM/WebGL synchronization is part of the concept", "smoothness is the only rationale", { cleanup: ["remove the exact shared ticker callback", "destroy Lenis"] }),
  profile("pixi", "pixi.js", `import { Application } from "pixi.js"`, "the experience is fundamentally high-density interactive 2D", "DOM/SVG handles the object count and effects cleanly", { cleanup: ["stop ticker", "destroy application, children, textures, and canvas"] }),
  profile("rive", "@rive-app/webgl2", `import { Rive } from "@rive-app/webgl2"`, "a supplied state-machine asset drives a branded diagram, mascot, or control", "there is no authored .riv asset or the animation is passive decoration", { cleanup: ["stop and delete the Rive instance", "remove canvas listeners"] }),
  profile("three", "three", `import * as THREE from "three"`, "real depth, camera, lighting, or geometry explains the subject", "the output behaves like a flat image", { cleanup: ["dispose renderer, textures, materials, and geometries"] }),
  profile("react-three-fiber", "@react-three/fiber", `import { Canvas } from "@react-three/fiber"`, "Three.js belongs to a React component tree", "raw Three.js has a smaller and clearer ownership boundary"),
  profile("ogl", "ogl", `import { Renderer, Program, Mesh } from "ogl"`, "a bounded WebGL media treatment needs a small low-level runtime", "Three.js scene features or native Canvas are a better fit"),
  profile("sharp", "sharp", `import sharp from "sharp"`, "build-time responsive images, posters, atlases, or displacement assets are required", "the work is expected in a client bundle", { buildTimeOnly: true }),
  profile("ffmpeg", "ffmpeg-static", `import ffmpegPath from "ffmpeg-static"`, "existing footage needs compression, posters, transparent fallbacks, or frame extraction", "no verified executable or source footage is available", { buildTimeOnly: true }),
];

export interface NativeFoundation {
  id: string;
  name: string;
  aliases: string[];
  summary: string;
  suitableTreatments: SpecialistSkill[];
  /** Optional alternatives to the native implementation; never installed implicitly. */
  packageProfiles: string[];
  implementation: string;
  implementationExport: string;
  guide: string;
  useWhen: string;
  rejectWhen: string;
  mobileTranslation: string;
  reducedMotionStrategy: string;
  semanticFallback: string;
  cleanup: string[];
  performanceBudget: string[];
  browserTest: string[];
  visualExample: string;
  risk: CreativeRisk;
}

const system = (
  id: string,
  name: string,
  implementationExport: string,
  options: Omit<NativeFoundation, "id" | "name" | "implementation" | "implementationExport" | "guide" | "visualExample">,
): NativeFoundation => ({
  id, name, implementationExport,
  implementation: "systems/runtime.js",
  guide: `systems/NATIVE_FOUNDATIONS.md#${id}`,
  visualExample: `systems/demo.html#${id}`,
  ...options,
});

const shared = {
  semanticFallback: "Keep the real content and controls in accessible DOM with an intentional resolved still.",
  cleanup: ["return one idempotent destroy function", "remove every owned listener, observer, RAF, and generated node"],
  performanceBudget: ["activate only near the viewport", "allocate nothing continuously inside the frame loop", "measure on the target mobile viewport"],
  browserTest: ["verify initial, active, reverse, and resolved states", "verify 390px, reduced motion, keyboard access, and cleanup"],
};

export const CREATIVE_MECHANISMS: NativeFoundation[] = [
  system("section-observer", "Section observer", "mountSectionObserver", {
    aliases: ["section reveal", "in-view states"], summary: "Publish one-shot or reversible section states without hiding readable content.",
    suitableTreatments: ["refined", "motion"], packageProfiles: [], useWhen: "section state changes need a small native trigger", rejectWhen: "the only result is repeated fade-up animation",
    mobileTranslation: "Shorten travel and keep content visible before JavaScript.", reducedMotionStrategy: "Publish the resolved state immediately.", risk: "low", ...shared,
  }),
  system("scroll-progress", "Normalized scroll progress", "mountScrollProgress", {
    aliases: ["scroll clock", "scroll velocity"], summary: "Own normalized progress, direction, and clamped velocity for one scroll subject.",
    suitableTreatments: ["motion", "immersive"], packageProfiles: [], useWhen: "several effects need the same measured native-scroll signal", rejectWhen: "a CSS scroll timeline or no shared signal is enough",
    mobileTranslation: "Clamp velocity more aggressively and avoid continuous decorative work.", reducedMotionStrategy: "Publish progress without velocity-driven distortion.", risk: "medium", ...shared,
  }),
  system("pinned-chapter", "Pinned narrative chapter", "mountPinnedChapter", {
    aliases: ["sticky chapter", "scroll story"], summary: "Map one sticky chapter to discrete authored states with safe entry and release.",
    suitableTreatments: ["motion", "cinematic", "immersive"], packageProfiles: ["gsap-scrolltrigger"], useWhen: "the content has a real sequence that benefits from controlled comparison", rejectWhen: "pinning delays access to ordinary copy",
    mobileTranslation: "Use shorter sticky travel or a swipe/step sequence.", reducedMotionStrategy: "Render the states as a normal vertical sequence.", risk: "high", ...shared,
  }),
  system("shared-element-handoff", "Shared-element handoff", "runSharedElementHandoff", {
    aliases: ["shared element", "FLIP transition"], summary: "Preserve subject identity while its owning layout changes.",
    suitableTreatments: ["motion", "interaction", "cinematic"], packageProfiles: ["motion", "gsap-flip"], useWhen: "the same product, image, or object genuinely continues into another state", rejectWhen: "source and destination do not represent the same subject",
    mobileTranslation: "Keep the handoff shorter and preserve focus after the state change.", reducedMotionStrategy: "Change layout instantly while retaining focus and identity.", risk: "medium", ...shared,
  }),
  system("frame-sequence", "Responsive frame sequence", "mountFrameSequence", {
    aliases: ["image sequence", "frame scrub", "product turntable", "frame-by-frame product animation"], summary: "Scrub a bounded manifest with posters, missing-frame recovery, and responsive sources.",
    suitableTreatments: ["media", "motion", "cinematic"], packageProfiles: ["sharp", "ffmpeg"], useWhen: "pre-rendered motion gives better fidelity or cost than real-time simulation", rejectWhen: "a short video or two stills communicate the same thing",
    mobileTranslation: "Load fewer frames, smaller derivatives, and a poster-first fallback.", reducedMotionStrategy: "Show the most informative resolved frame.", risk: "high", ...shared,
  }),
  system("persistent-stage", "Persistent subject stage", "mountPersistentStage", {
    aliases: ["persistent product", "cross-section stage"], summary: "Carry one semantic subject through named section berths without covering content.",
    suitableTreatments: ["media", "immersive", "3d"], packageProfiles: ["gsap-scrolltrigger"], useWhen: "one subject develops meaning across several sections", rejectWhen: "the object is merely a floating decoration",
    mobileTranslation: "Dock the subject in-flow at deliberate handoff points.", reducedMotionStrategy: "Place resolved stills at each meaningful berth.", risk: "high", ...shared,
  }),
  system("drag-rail", "Accessible drag rail", "mountDragRail", {
    aliases: ["drag gallery", "inertial rail"], summary: "Provide pointer drag, touch scroll, keyboard stepping, bounds, and snap states.",
    suitableTreatments: ["interaction", "mobile", "media"], packageProfiles: ["motion"], useWhen: "direct manipulation improves browsing distinct items", rejectWhen: "a standard list or carousel is clearer",
    mobileTranslation: "Prefer native horizontal scrolling with snap and visible next content.", reducedMotionStrategy: "Remove inertia and snap instantly.", risk: "medium", ...shared,
  }),
  system("kinetic-type", "Semantic kinetic type", "mountKineticType", {
    aliases: ["split text", "type choreography"], summary: "Animate semantic words as hierarchy while preserving the original accessible text.",
    suitableTreatments: ["refined", "motion", "experimental"], packageProfiles: ["gsap-splittext"], useWhen: "language itself is a meaningful visual material", rejectWhen: "splitting delays reading or creates decorative letter noise",
    mobileTranslation: "Animate fewer groups with shorter distance.", reducedMotionStrategy: "Keep the final semantic text unchanged.", risk: "medium", ...shared,
  }),
  system("adaptive-canvas", "Adaptive 2D canvas", "mountAdaptiveCanvas", {
    aliases: ["pixi field", "2D renderer", "sprite field"], summary: "Own a bounded high-density 2D surface with DPR caps, visibility pause, and DOM fallback.",
    suitableTreatments: ["media", "interaction", "experimental"], packageProfiles: ["pixi"], useWhen: "many sprites or a 2D shader exceed clean DOM/SVG handling", rejectWhen: "the scene is actually 3D or a few DOM nodes suffice",
    mobileTranslation: "Reduce count and resolution; switch to the fallback below the measured budget.", reducedMotionStrategy: "Render a static composition and stop the ticker.", risk: "high", ...shared,
  }),
  system("video-handoff", "Video-to-layout handoff", "mountVideoHandoff", {
    aliases: ["video becomes layout", "cinematic video chapter"], summary: "Match a meaningful video frame into accessible editorial DOM.",
    suitableTreatments: ["media", "cinematic"], packageProfiles: ["ffmpeg"], useWhen: "footage establishes information that continues into the page", rejectWhen: "video is a background loop unrelated to the content",
    mobileTranslation: "Use a poster or short muted derivative before handing off early.", reducedMotionStrategy: "Use the matched poster and resolved DOM.", risk: "high", ...shared,
  }),
  system("spatial-gallery", "Bounded spatial gallery", "mountSpatialGallery", {
    aliases: ["3D gallery", "depth gallery"], summary: "Navigate a finite media field with selection, list semantics, and bounded depth.",
    suitableTreatments: ["3d", "interaction", "immersive"], packageProfiles: ["three", "react-three-fiber"], useWhen: "spatial relationships help users understand or browse the collection", rejectWhen: "depth adds travel without information",
    mobileTranslation: "Use a snap rail or shallow stacked depth with the same selection model.", reducedMotionStrategy: "Render the semantic list with no camera travel.", risk: "high", ...shared,
  }),
  system("media-trail", "Bounded media trail", "mountMediaTrail", {
    aliases: ["image trail", "pointer trail"], summary: "Reveal a short-lived trail of real project media with strict density and input bounds.",
    suitableTreatments: ["interaction", "media", "experimental"], packageProfiles: ["pixi"], useWhen: "exploration or authorship is expressed through accumulating project imagery", rejectWhen: "a cursor follower would cover controls or become permanent decoration",
    mobileTranslation: "Trigger a sparse trail from deliberate drag gestures only.", reducedMotionStrategy: "Show one selected image without a trail.", risk: "medium", ...shared,
  }),
];

export interface ExternalCreativeReference {
  source: string;
  sourceType: string;
  principleExtracted: string;
  adapt: string;
  deliberatelyDiffer: string[];
  license: string;
  attributionRequired: boolean | null;
}

export function validateExternalReference(reference: ExternalCreativeReference): string[] {
  const errors: string[] = [];
  for (const key of ["source", "sourceType", "principleExtracted", "adapt", "license"] as const)
    if (!reference[key] || reference[key].trim().length < 3) errors.push(`${key} is required`);
  if (reference.deliberatelyDiffer.length < 2) errors.push("deliberatelyDiffer must name at least two concrete differences");
  if (reference.attributionRequired === null) errors.push("attributionRequired must be resolved");
  return errors;
}

export interface CreativeStackResolution {
  scrollOwner: "native" | "lenis";
  timelineEngine: "native" | "motion" | "gsap";
  packageProfiles: PackageProfile[];
  installCommands: string[];
  fallbacks: string[];
  blockers: string[];
}

export function resolveCreativeStack(
  systemIds: string[],
  options: { installed?: string[]; installationAllowed?: boolean; capabilities?: string[]; enhancement?: string; framework?: string } = {},
): CreativeStackResolution {
  const systems = systemIds.map((id) => CREATIVE_MECHANISMS.find((item) => item.id === id)).filter((item): item is NativeFoundation => Boolean(item));
  const blockers = systemIds.filter((id) => !systems.some((item) => item.id === id)).map((id) => `unknown native foundation ${id}`);
  const requestedIds = new Set<string>();
  if (options.enhancement) {
    const profile = PACKAGE_PROFILES.find((item) => item.id === options.enhancement);
    if (!profile) blockers.push(`unknown enhancement ${options.enhancement}`);
    else if (!systems.some((item) => item.packageProfiles.includes(profile.id))) blockers.push(`${profile.id} is not an enhancement for the selected foundations`);
    else if (["react-three-fiber", "gsap-react"].includes(profile.id) && !/^(react|next)$/i.test(options.framework ?? "")) blockers.push(`${profile.id} requires a confirmed React framework`);
    else requestedIds.add(profile.id);
  }
  const selectedProfiles = blockers.length ? [] : PACKAGE_PROFILES.filter((item) => requestedIds.has(item.id));
  const installed = new Set(options.installed ?? []);
  const missing = selectedProfiles.filter((item) => !installed.has(item.packageName));
  const fallbacks: string[] = [];
  for (const item of missing) {
    if (item.id === "ffmpeg" && !(options.capabilities ?? []).includes("ffmpeg-processing"))
      fallbacks.push("Use supplied poster/stills or a verified external media pipeline.");
    else if (options.installationAllowed === false)
      fallbacks.push(`${item.id}: use the native foundation's static fallback.`);
  }
  return {
    scrollOwner: requestedIds.has("lenis") ? "lenis" : "native",
    timelineEngine: [...requestedIds].some((id) => id.startsWith("gsap")) ? "gsap" : requestedIds.has("motion") ? "motion" : "native",
    packageProfiles: selectedProfiles,
    installCommands: options.installationAllowed === false ? [] : [...new Set(missing.map((item) => `npm install ${item.packageName}`))],
    fallbacks,
    blockers,
  };
}

export function searchCreativeCatalog(query: string): NativeFoundation[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return CREATIVE_MECHANISMS
    .map((item) => ({ item, score: terms.reduce((score, term) => score + [item.id, item.name, ...item.aliases, item.summary, item.useWhen].join(" ").toLowerCase().split(term).length - 1, 0) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .map(({ item }) => item);
}

export function validateCreativeCatalog(): string[] {
  const errors: string[] = [];
  const ids = new Set(PACKAGE_PROFILES.map((item) => item.id));
  if (CREATIVE_MECHANISMS.length !== 12) errors.push("native foundation count must remain exactly 12");
  if (new Set(CREATIVE_MECHANISMS.map((item) => item.id)).size !== CREATIVE_MECHANISMS.length) errors.push("native foundation IDs must be unique");
  for (const item of CREATIVE_MECHANISMS) {
    for (const id of item.packageProfiles) if (!ids.has(id)) errors.push(`${item.id}: unknown package profile ${id}`);
    if (!item.implementation || !item.implementationExport || !item.guide || !item.visualExample) errors.push(`${item.id}: missing executable resources`);
    if (!item.useWhen || !item.rejectWhen || !item.mobileTranslation || !item.reducedMotionStrategy || !item.semanticFallback) errors.push(`${item.id}: incomplete decision contract`);
    if (!item.cleanup.length || !item.performanceBudget.length || !item.browserTest.length) errors.push(`${item.id}: incomplete lifecycle or verification contract`);
  }
  return errors;
}

export function renderAgentCatalogue(query?: string): string {
  const entries = query ? searchCreativeCatalog(query) : CREATIVE_MECHANISMS;
  return [
    "# Dreative native foundations", "",
    ...entries.flatMap((item) => [
      `## ${item.name} (${item.id})`,
      `Purpose: ${item.summary}`,
      `Use when: ${item.useWhen}`,
      `Reject when: ${item.rejectWhen}`,
      `Implementation: ${item.implementation}#${item.implementationExport}`,
      `Guide: ${item.guide}`,
      `Packages: ${item.packageProfiles.join(", ") || "native"}`,
      `Fallback: ${item.semanticFallback}`,
      "",
    ]),
  ].join("\n");
}
