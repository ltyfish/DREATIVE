import type { SpecialistSkill } from "./skillSystem.js";

export type CreativeAmbition = "standard" | "expressive" | "award" | "experimental";
export type CreativeRisk = "low" | "medium" | "high";
export type CreativeMechanismFamily = "scroll-choreography" | "media-transformation" | "spatial-3d" | "typography" | "interaction" | "scene-transition" | "atmosphere";

export interface PackageProfile {
  id: string;
  packageName: string;
  versionStrategy: string;
  frameworks: string[];
  install: string;
  importForm: string;
  licenseConsiderations: string;
  runtimeCapabilities: string[];
  browserLimitations: string[];
  reducedMotion: string;
  mobile: string;
  buildChecks: string[];
  browserChecks: string[];
  cleanup: string[];
  optional: boolean;
  buildTimeOnly?: boolean;
}

const profile = (id: string, packageName: string, importForm: string, options: Partial<PackageProfile> = {}): PackageProfile => ({
  id, packageName, importForm,
  versionStrategy: "Resolve the current compatible stable release from the target lockfile and framework; never invent or silently widen a version.",
  frameworks: ["vanilla", "react", "next", "vite"],
  install: `npm install ${packageName}`,
  licenseConsiderations: "Check the current upstream package and plugin license before installation; record source, version, notices and any use restrictions.",
  runtimeCapabilities: ["modern browser JavaScript"],
  browserLimitations: ["Verify on the actual target browsers and low-power mobile hardware."],
  reducedMotion: "Do not initialize non-essential continuous motion when prefers-reduced-motion is active; retain an intentional resolved state.",
  mobile: "Use a touch-native translation and measure frame time, memory, loading and input behavior.",
  buildChecks: ["package resolves", "production build passes", "tree-shaken plugin remains registered when applicable"],
  browserChecks: ["no runtime or hydration errors", "expected visual state is observable"],
  cleanup: ["remove listeners, tickers and observers", "dispose owned runtime resources"],
  optional: true,
  ...options,
});

export const PACKAGE_PROFILES: PackageProfile[] = [
  profile("gsap", "gsap", "import { gsap } from 'gsap'", { optional: false }),
  profile("gsap-react", "@gsap/react", "import { useGSAP } from '@gsap/react'", { frameworks: ["react", "next", "vite"], cleanup: ["use useGSAP with a scope ref", "wrap delayed handlers with contextSafe"] }),
  profile("gsap-scrolltrigger", "gsap", "import { ScrollTrigger } from 'gsap/ScrollTrigger'; gsap.registerPlugin(ScrollTrigger)", { runtimeCapabilities: ["layout measurement", "scroll progress"], browserChecks: ["pin entry and exit do not jump", "reverse scroll works", "refresh after fonts and media load"] }),
  profile("gsap-flip", "gsap", "import { Flip } from 'gsap/Flip'; gsap.registerPlugin(Flip)"),
  profile("gsap-observer", "gsap", "import { Observer } from 'gsap/Observer'; gsap.registerPlugin(Observer)"),
  profile("gsap-draggable", "gsap", "import { Draggable } from 'gsap/Draggable'; gsap.registerPlugin(Draggable)"),
  profile("gsap-inertia", "gsap", "import { InertiaPlugin } from 'gsap/InertiaPlugin'; gsap.registerPlugin(InertiaPlugin)"),
  profile("gsap-motionpath", "gsap", "import { MotionPathPlugin } from 'gsap/MotionPathPlugin'; gsap.registerPlugin(MotionPathPlugin)"),
  profile("gsap-splittext", "gsap", "import { SplitText } from 'gsap/SplitText'; gsap.registerPlugin(SplitText)"),
  profile("gsap-morphsvg", "gsap", "import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'; gsap.registerPlugin(MorphSVGPlugin)"),
  profile("lenis", "lenis", "import Lenis from 'lenis'; import 'lenis/dist/lenis.css'", { runtimeCapabilities: ["single shared scroll clock"], browserChecks: ["anchors work", "nested and modal scroll are not trapped", "navigation stops or resets inertia", "no duplicate RAF loop"], cleanup: ["remove the exact GSAP ticker callback when shared", "destroy Lenis"] }),
  profile("three", "three", "import * as THREE from 'three'", { runtimeCapabilities: ["WebGL"], cleanup: ["dispose renderer, textures, materials and geometries", "remove resize and visibility handlers"] }),
  profile("react-three-fiber", "@react-three/fiber", "import { Canvas, useFrame } from '@react-three/fiber'", { frameworks: ["react", "next", "vite"] }),
  profile("react-three-drei", "@react-three/drei", "import { useTexture } from '@react-three/drei'", { frameworks: ["react", "next", "vite"] }),
  profile("react-three-postprocessing", "@react-three/postprocessing", "import { EffectComposer } from '@react-three/postprocessing'", { frameworks: ["react", "next", "vite"] }),
  profile("postprocessing", "postprocessing", "import { EffectComposer } from 'postprocessing'", { runtimeCapabilities: ["WebGL2 recommended"] }),
  profile("ogl", "ogl", "import { Renderer, Program, Mesh } from 'ogl'", { runtimeCapabilities: ["WebGL"] }),
  profile("motion", "motion", "import { animate } from 'motion'"),
  profile("use-gesture", "@use-gesture/react", "import { useDrag } from '@use-gesture/react'", { frameworks: ["react", "next", "vite"] }),
  profile("matter", "matter-js", "import Matter from 'matter-js'", { runtimeCapabilities: ["Canvas or DOM physics mapping"] }),
  profile("rapier", "@react-three/rapier", "import { Physics } from '@react-three/rapier'", { frameworks: ["react", "next", "vite"], runtimeCapabilities: ["WebAssembly", "WebGL"] }),
  profile("sharp", "sharp", "import sharp from 'sharp'", { frameworks: ["node-build"], buildTimeOnly: true, runtimeCapabilities: ["Node native module support"], browserLimitations: ["Never import into client bundles."] }),
  profile("ffmpeg", "ffmpeg-static", "import ffmpegPath from 'ffmpeg-static'", { frameworks: ["node-build"], buildTimeOnly: true, runtimeCapabilities: ["confirmed executable binary"], browserLimitations: ["Build-time only; validate generated codecs separately."] }),
  profile("remotion", "remotion", "import { Composition } from 'remotion'", { frameworks: ["react", "node-build"], buildTimeOnly: true, runtimeCapabilities: ["confirmed Remotion renderer and browser executable"] }),
  profile("remotion-cli", "@remotion/cli", "npx remotion render", { frameworks: ["node-build"], buildTimeOnly: true, runtimeCapabilities: ["confirmed browser executable", "filesystem output"] }),
  profile("remotion-player", "@remotion/player", "import { Player } from '@remotion/player'", { frameworks: ["react", "next", "vite"] }),
  profile("remotion-transitions", "@remotion/transitions", "import { TransitionSeries } from '@remotion/transitions'", { frameworks: ["react", "node-build"], buildTimeOnly: true }),
  profile("image-sequence", "sharp", "Use sharp plus a bounded frame manifest generated at build time", { frameworks: ["node-build"], buildTimeOnly: true }),
];

export interface CreativePrimitive {
  id: string;
  semanticPurpose: string;
  compositionRequirements: string[];
  contentRoles: string[];
  packageProfiles: string[];
  reactGuidance: string;
  vanillaGuidance: string;
  lifecycleCleanup: string[];
  resizeHandling: string;
  loadingHandling: string;
  assetErrorHandling: string;
  reducedMotionMode: string;
  mobileTranslation: string;
  semanticFallback: string;
  performanceControls: string[];
  acceptableDegradation: string;
  browserVerification: string[];
  evidenceStates: string[];
  antiPatterns: string[];
}

const primitive = (id: string, semanticPurpose: string, packageProfiles: string[] = [], extra: Partial<CreativePrimitive> = {}): CreativePrimitive => ({
  id, semanticPurpose, packageProfiles,
  compositionRequirements: ["Bind to real project content and a named section role.", "Define start, active and resolved compositions before implementation."],
  contentRoles: ["structural transition", "continuity system", "authored media moment"],
  reactGuidance: "Keep the imperative runtime in an isolated client leaf; use scoped cleanup and stable refs rather than render-loop state.",
  vanillaGuidance: "Own one root, one lifecycle controller and an idempotent destroy function.",
  lifecycleCleanup: ["remove listeners and ticker callbacks", "cancel pending loads", "dispose owned GPU or media resources"],
  resizeHandling: "Use ResizeObserver or the runtime resize API, refresh measured timelines after assets settle, and preserve current progress.",
  loadingHandling: "Render semantic DOM and a poster/skeleton before the advanced layer becomes ready; expose bounded progress for sequences.",
  assetErrorHandling: "Keep the semantic fallback visible, record the failed asset, and activate the approved fallback without calling missing APIs.",
  reducedMotionMode: "Render intentional start and resolved semantic states without continuous or vestibular travel.",
  mobileTranslation: "Translate the same narrative cause and effect for touch, with lower counts, shorter travel and measured budgets.",
  semanticFallback: "Accessible DOM content and project-specific still media remain reachable when the advanced layer fails.",
  performanceControls: ["intersection activation", "visibility pause", "adaptive quality", "bounded asset and object counts"],
  acceptableDegradation: "Reduce density, depth or duration while preserving identity, hierarchy and section role.",
  browserVerification: ["initial, midpoint and end differ visibly", "mobile and reduced-motion states work", "no console error, trapped scroll or blank surface"],
  evidenceStates: ["initial", "midpoint", "peak", "end", "mobile", "reduced-motion"],
  antiPatterns: ["demo styling", "hero-only use", "decorative overlay", "unscoped lifecycle", "silent mobile removal"],
  ...extra,
});

export const CREATIVE_PRIMITIVES: CreativePrimitive[] = [
  primitive("dreative-scroll-clock", "Own one normalized native or Lenis scroll clock and publish progress, direction and clamped velocity.", ["lenis", "gsap-scrolltrigger"], { antiPatterns: ["competing RAF loops", "Lenis without a mechanism need", "broken native anchors"] }),
  primitive("dreative-gsap-scope", "Scope GSAP timelines and plugin lifecycle to one component or route.", ["gsap", "gsap-react"]),
  primitive("dreative-pinned-chapter", "Hold one narrative chapter while content, media and type progress through authored states.", ["gsap-scrolltrigger"]),
  primitive("dreative-persistent-stage", "Carry one media or spatial subject across several sections with explicit berths and occlusion rules.", ["gsap-scrolltrigger", "three"]),
  primitive("dreative-media-plane", "Render project media as a controllable DOM, Canvas, OGL or Three.js surface.", ["ogl", "three"]),
  primitive("dreative-velocity-material", "Map clamped input velocity to temporary material distortion and a crisp settle.", ["lenis", "gsap-scrolltrigger", "ogl"]),
  primitive("dreative-fragment-field", "Segment one project image into authored pieces that change composition.", ["gsap", "three"]),
  primitive("dreative-particle-reconstruction", "Reconstruct a recognizable project subject from bounded particles.", ["three"]),
  primitive("dreative-frame-sequence", "Progressively load and scrub a responsive image sequence with posters and missing-frame recovery.", ["gsap-scrolltrigger", "sharp", "ffmpeg"]),
  primitive("dreative-shared-element-handoff", "Preserve subject identity while ownership moves between layouts or renderers.", ["gsap-flip"]),
  primitive("dreative-depth-dive", "Travel through layered project media into a related destination chapter.", ["gsap-scrolltrigger", "three"]),
  primitive("dreative-spatial-gallery", "Navigate an authored field of distinct project media with pointer, touch and keyboard equivalents.", ["three", "use-gesture"]),
  primitive("dreative-kinetic-type", "Make semantic typography participate in hierarchy, geometry or media revelation.", ["gsap-splittext"]),
  primitive("dreative-video-texture", "Use decoded footage as treated scene material with poster, codec and still fallbacks.", ["three", "ffmpeg"]),
  primitive("dreative-scene-transition", "Connect adjacent sections through one reversible structural handoff.", ["gsap", "gsap-scrolltrigger"]),
  primitive("dreative-drag-constellation", "Arrange project media in a bounded inertial field with touch and list fallbacks.", ["gsap-draggable", "gsap-inertia", "use-gesture"]),
];

export interface MechanismReference { source: string; sourceType: "primary-docs" | "repository" | "project-reference"; license: string; attributionRequired: boolean; principle: string; }
export interface CreativeMechanism {
  id: string; name: string; aliases: string[]; family: CreativeMechanismFamily; summary: string; visualOutcome: string;
  suitableAmbitions: CreativeAmbition[]; suitableTreatments: SpecialistSkill[]; contentRoles: string[]; continuityRoles: string[];
  preferredImplementations: string[]; possibleImplementations: string[]; preferredPackages: string[]; optionalPackages: string[]; packageProfiles: string[];
  primitive: string; recipe: string; exemplar?: string; prototypeRisk: CreativeRisk; performanceRisk: CreativeRisk; accessibilityRisk: CreativeRisk;
  mobileRisk: CreativeRisk; originalityRisk: CreativeRisk; reducedMotionStrategy: string; mobileTranslation: string; semanticFallback: string;
  requiredEvidence: string[]; knownTensions: string[]; incompatibleCombinations: string[]; compositionalRequirements: string[];
  continuityRequirements: string[]; antiPatterns: string[]; positiveSignals: string[]; references: MechanismReference[];
}

type MechanismSeed = readonly [name: string, aliases?: string[], packages?: string[], primitive?: string, exemplar?: string];
const families: Record<CreativeMechanismFamily, MechanismSeed[]> = {
  "scroll-choreography": [
    ["pinned narrative chapter"], ["continuous scroll scene", ["smooth scroll WebGL"], ["gsap-scrolltrigger"], "dreative-scroll-clock"], ["horizontal scroll gallery", [], ["gsap-scrolltrigger", "lenis"]], ["infinite spatial rail", [], ["lenis", "gsap-observer"]], ["velocity-reactive scene", ["velocity distortion"], ["lenis", "gsap-scrolltrigger"], "dreative-velocity-material"], ["scroll-controlled frame sequence", ["scroll image sequence", "frame-by-frame product animation"], ["gsap-scrolltrigger", "sharp", "ffmpeg"], "dreative-frame-sequence", "frame-sequence"], ["scroll-driven camera path", [], ["gsap-scrolltrigger", "three"]], ["scroll-controlled text transformation"], ["overlapping card stack"], ["sticky media handoff"], ["section-to-section persistent object", ["persistent product across sections", "spatial product story"], ["gsap-scrolltrigger"], "dreative-persistent-stage", "persistent-object"], ["reversible scrubbed timeline"], ["snap-assisted chapter"], ["scroll-progress material transformation"]
  ],
  "media-transformation": [
    ["image fragmentation", ["photo disintegration", "image tears into pieces"], ["gsap", "three"], "dreative-fragment-field", "fragment-reconstruction"], ["image reconstruction", ["photo reconstruction"], ["three"], "dreative-particle-reconstruction", "fragment-reconstruction"], ["image tornado", ["photo tornado"], ["gsap", "three"], "dreative-fragment-field", "image-tornado"], ["image trail"], ["image swarm"], ["image slice transition"], ["torn-paper transition"], ["folded-media transition"], ["pixel dissolve"], ["particle dissolve"], ["fluid displacement"], ["velocity smear", ["media plane distortion"], ["lenis", "ogl"], "dreative-velocity-material", "velocity-refraction"], ["chromatic separation"], ["depth-map displacement", ["depth-map zoom"], ["three"], "dreative-depth-dive"], ["parallax media plane"], ["refractive media plane"], ["liquid distortion"], ["metallic material"], ["shader-based reveal"], ["video texture", ["cinematic video chapter"], ["three", "ffmpeg"], "dreative-video-texture", "video-to-layout"], ["video mask"], ["video-to-canvas sampling"], ["image-sequence scrub"], ["texture atlas animation"], ["layered cutout parallax"], ["editorial crop choreography"], ["image-to-video transition"], ["particle reconstruction"], ["media plane refraction"], ["frame extraction pipeline"], ["remotion rendered sequence", [], ["remotion", "remotion-cli", "ffmpeg"]]
  ],
  "spatial-3d": [
    ["spatial gallery", ["3D gallery"], ["three", "react-three-fiber"], "dreative-spatial-gallery", "drag-constellation"], ["dome gallery"], ["poster tunnel"], ["orbiting media"], ["depth dive"], ["camera fly-through"], ["3D product stage"], ["model viewer"], ["object constellation", ["drag-controlled images"]], ["drag-controlled spatial composition"], ["physics-assisted object field", [], ["matter", "rapier"]], ["particle field"], ["spatial ribbon field", ["ribbon field"]], ["volumetric light"], ["WebGL media carousel"], ["scene portal"], ["shared 3D object across sections"], ["spatial product story"]
  ],
  typography: [
    ["split-character entrance"], ["split-word entrance"], ["kinetic typography"], ["variable-font proximity"], ["scroll velocity typography"], ["text scrambling"], ["text decryption"], ["text-to-shape transition"], ["text-to-image transition", ["type becomes image"], ["gsap", "three"], "dreative-kinetic-type", "type-to-media"], ["curved text"], ["path-based typography"], ["typography fragmentation"], ["typography reconstruction"], ["masked video typography"], ["3D type"], ["perspective type field"], ["text pressure"], ["text trail"], ["animated counter"], ["editorial type choreography"]
  ],
  interaction: [
    ["magnetic interaction"], ["drag inertia"], ["elastic controls"], ["custom cursor"], ["image-follow cursor"], ["target cursor"], ["proximity deformation"], ["hover refraction"], ["cursor-driven spotlight"], ["card tilt"], ["glare and specular response"], ["object peel"], ["liquid navigation"], ["interactive physics"], ["gesture-controlled gallery"], ["pointer-controlled shader"], ["audio-reactive scene"]
  ],
  "scene-transition": [
    ["shared-element transition", [], ["gsap-flip"], "dreative-shared-element-handoff", "shared-element"], ["FLIP transition"], ["masking transition"], ["depth transition"], ["camera transition"], ["page cover transition"], ["media takeover"], ["object handoff"], ["continuity morph"], ["scene reconstruction"], ["video-to-layout transition", ["video becomes layout"], ["gsap", "three"], "dreative-video-texture", "video-to-layout"], ["layout-to-canvas transition"], ["canvas-to-DOM transition"]
  ],
  atmosphere: [
    ["procedural gradient"], ["shader field"], ["particle atmosphere"], ["grain"], ["dithering"], ["volumetric rays"], ["noise displacement"], ["liquid chrome", ["liquid chrome background"]], ["iridescence"], ["aurora field"], ["line field"], ["atmospheric ribbon field", ["ribbon field"]], ["depth fog"], ["light tunnel"], ["responsive texture system"]
  ],
};

const slug = (value: string) => value.toLowerCase().replace(/3d/g, "3d").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const familyDefaults: Record<CreativeMechanismFamily, { treatments: SpecialistSkill[]; primitive: string; packages: string[]; risk: CreativeRisk }> = {
  "scroll-choreography": { treatments: ["motion", "cinematic", "immersive"], primitive: "dreative-pinned-chapter", packages: ["gsap-scrolltrigger"], risk: "medium" },
  "media-transformation": { treatments: ["media", "motion", "experimental"], primitive: "dreative-media-plane", packages: ["gsap"], risk: "medium" },
  "spatial-3d": { treatments: ["3d", "immersive", "interaction"], primitive: "dreative-spatial-gallery", packages: ["three"], risk: "high" },
  typography: { treatments: ["motion", "refined", "experimental"], primitive: "dreative-kinetic-type", packages: ["gsap"], risk: "medium" },
  interaction: { treatments: ["interaction", "motion", "mobile"], primitive: "dreative-drag-constellation", packages: ["gsap"], risk: "medium" },
  "scene-transition": { treatments: ["cinematic", "motion", "immersive"], primitive: "dreative-scene-transition", packages: ["gsap"], risk: "medium" },
  atmosphere: { treatments: ["refined", "immersive", "experimental"], primitive: "dreative-media-plane", packages: [], risk: "medium" },
};
const primaryRefs: Record<string, MechanismReference> = {
  gsap: { source: "https://gsap.com/docs/", sourceType: "primary-docs", license: "verify-current", attributionRequired: false, principle: "Scoped, reversible timeline orchestration." },
  lenis: { source: "https://github.com/darkroomengineering/lenis", sourceType: "repository", license: "MIT", attributionRequired: true, principle: "Optional normalized scroll interpolation and velocity." },
  reactbits: { source: "https://github.com/DavidHDev/react-bits", sourceType: "repository", license: "verify-component-and-repository", attributionRequired: true, principle: "Reference vocabulary only; select and substantially transform in the user project." },
};

export const CREATIVE_MECHANISMS: CreativeMechanism[] = Object.entries(families).flatMap(([family, seeds]) => seeds.map(([name, aliases = [], packageOverride, primitiveOverride, exemplar]) => {
  const defaults = familyDefaults[family as CreativeMechanismFamily];
  const packageProfiles = packageOverride ?? defaults.packages;
  return {
    id: slug(name), name, aliases, family: family as CreativeMechanismFamily,
    summary: `Use ${name} as an authored structural mechanism bound to project content, not as a detached demonstration effect.`,
    visualOutcome: `${name} produces distinct start, active and resolved states that change composition, material, viewpoint or meaning.`,
    suitableAmbitions: family === "atmosphere" ? ["expressive", "award", "experimental"] : ["award", "experimental"],
    suitableTreatments: defaults.treatments, contentRoles: ["section peak", "transition", "continuity"], continuityRoles: ["handoff", "development", "resolution"],
    preferredImplementations: packageProfiles.length ? ["package-backed scoped runtime"] : ["native DOM, CSS, SVG or Canvas"],
    possibleImplementations: ["DOM/SVG", "Canvas", "WebGL", "pre-rendered media"], preferredPackages: packageProfiles.slice(0, 1), optionalPackages: packageProfiles.slice(1), packageProfiles,
    primitive: primitiveOverride ?? defaults.primitive, recipe: `recipes/${family}-recipes.md#${slug(name)}`, exemplar,
    prototypeRisk: defaults.risk, performanceRisk: defaults.risk, accessibilityRisk: family === "interaction" ? "high" : "medium", mobileRisk: defaults.risk, originalityRisk: "medium",
    reducedMotionStrategy: "Preserve the semantic start and resolved composition, remove continuous travel, and keep all content and navigation reachable.",
    mobileTranslation: "Keep the same project-specific cause and effect with touch input, shorter travel, lower density and an explicit mobile budget.",
    semanticFallback: "Render the real content in accessible DOM with a project-specific poster or resolved still; disclose why the advanced path was unavailable.",
    requiredEvidence: ["initial state", "meaningful midpoint", "resolved end", "mobile translation", "reduced-motion state", "runtime health"],
    knownTensions: ["performance versus density", "authored continuity versus navigation speed"], incompatibleCombinations: ["second scroll owner", "unscoped competing animation loop"],
    compositionalRequirements: ["real project content", "named section role", "hierarchy with other mechanisms"], continuityRequirements: ["connect to at least one adjacent section or recurring motion language"],
    antiPatterns: ["default demo styling", "decorative-only use", "hero-only allocation", "fade-only substitute", "silent mobile disable"], positiveSignals: ["project media changes internally", "states are reversible when promised", "later sections remain authored"],
    references: [...(packageProfiles.includes("lenis") ? [primaryRefs.lenis] : []), ...(packageProfiles.some((item) => item.startsWith("gsap")) ? [primaryRefs.gsap] : []), primaryRefs.reactbits],
  };
}));

export interface CreativeExemplar {
  id: string; title: string; mechanismIds: string[]; packageProfiles: string[]; primitiveIds: string[]; implementationOutline: string[];
  expectedStates: string[]; performanceControls: string[]; reducedMotion: string; mobile: string; evidence: string[]; cleanup: string[]; failureFallback: string;
}
const exemplar = (id: string, title: string, mechanismIds: string[], packageProfiles: string[], primitiveIds: string[], outline: string[]): CreativeExemplar => ({
  id, title, mechanismIds, packageProfiles, primitiveIds, implementationOutline: outline,
  expectedStates: ["prepared", "active midpoint", "peak", "resolved"], performanceControls: ["lazy activate", "cap DPR/counts", "pause offscreen", "ship responsive derivatives"],
  reducedMotion: "Show a designed preparation and resolved state with no continuous travel.", mobile: "Shorten the path, reduce density and provide touch-native control without deleting the concept.",
  evidence: ["start", "25%", "50%", "75%", "end", "reverse when promised", "mobile", "reduced motion"], cleanup: ["revert scoped timelines", "remove tickers/listeners", "dispose media/GPU resources"],
  failureFallback: "Use the approved project-specific DOM, SVG, still or pre-rendered equivalent and record the observed trigger.",
});
export const CREATIVE_EXEMPLARS: CreativeExemplar[] = [
  exemplar("image-tornado", "Project image tornado becomes the next section", ["image-tornado"], ["gsap", "three"], ["dreative-fragment-field", "dreative-scene-transition"], ["sample source pixels into bounded project-specific fragments", "drive one reversible timeline", "land fragments as destination media rather than decorative debris"]),
  exemplar("fragment-reconstruction", "Image fragmentation and reconstruction", ["image-fragmentation", "image-reconstruction"], ["gsap", "three"], ["dreative-fragment-field", "dreative-particle-reconstruction"], ["author segmentation from the source image", "preserve subject identity at midpoint", "reconstruct into the next content role"]),
  exemplar("frame-sequence", "Responsive scroll-controlled frame sequence", ["scroll-controlled-frame-sequence"], ["gsap-scrolltrigger", "sharp", "ffmpeg"], ["dreative-frame-sequence"], ["generate desktop/mobile manifests and posters", "progressively decode a bounded window", "map clamped scroll progress and tolerate missing frames"]),
  exemplar("persistent-object", "Persistent subject across four sections", ["section-to-section-persistent-object"], ["gsap-scrolltrigger", "three"], ["dreative-persistent-stage"], ["declare four section berths", "interpolate pose and material through one owner", "release to semantic DOM at resolution"]),
  exemplar("velocity-refraction", "Lenis and GSAP synchronized velocity refraction", ["velocity-reactive-scene", "refractive-media-plane"], ["lenis", "gsap-scrolltrigger", "ogl"], ["dreative-scroll-clock", "dreative-velocity-material"], ["attach Lenis to the GSAP ticker", "clamp velocity into shader displacement", "settle crisply and remove the same ticker callback on cleanup"]),
  exemplar("type-to-media", "Semantic typography transforms into media geometry", ["text-to-image-transition"], ["gsap", "three"], ["dreative-kinetic-type", "dreative-shared-element-handoff"], ["retain semantic text", "map measured glyph bounds to media geometry", "resolve as editorial media with reading order intact"]),
  exemplar("shared-element", "GSAP Flip shared-element handoff", ["shared-element-transition"], ["gsap", "gsap-flip", "gsap-react"], ["dreative-gsap-scope", "dreative-shared-element-handoff"], ["capture Flip state", "move the real project node between semantic containers", "animate from the captured geometry and restore focus"]),
  exemplar("drag-constellation", "Drag-controlled project image constellation", ["drag-controlled-spatial-composition"], ["gsap-draggable", "gsap-inertia", "use-gesture"], ["dreative-drag-constellation"], ["place distinct project media in a bounded field", "map drag velocity to depth and selection", "provide keyboard list and mobile snap rail"]),
  exemplar("video-to-layout", "Video texture resolves into editorial DOM", ["video-texture", "video-to-layout-transition"], ["three", "gsap", "ffmpeg"], ["dreative-video-texture", "dreative-shared-element-handoff"], ["show poster until decoded", "treat footage as scene material", "match the last frame into accessible editorial DOM"]),
  exemplar("cinematic-arc", "Cinematic preparation, escalation, peak, rest and resolution", ["pinned-narrative-chapter", "masking-transition"], ["gsap", "gsap-scrolltrigger"], ["dreative-pinned-chapter", "dreative-scene-transition"], ["allocate preparation and escalation before the first peak", "use a structural handoff", "include a quiet reading section and authored resolution"]),
];

export interface ExternalCreativeReference {
  source: string; sourceType: string; mechanism: string; principleExtracted: string; projectSpecificUse: string; brandSpecificTransformation: string;
  plannedDifferences: string[]; packages: string[]; license: string; attributionRequired: boolean | null; performanceRisk: string; accessibilityRisk: string; originalityRisk: string;
  transformations: ("content" | "assets" | "composition" | "section-role" | "motion" | "timing" | "material" | "camera" | "interaction" | "responsive" | "continuity" | "meaning")[];
  redistributedWithDreative?: boolean;
}
export function validateExternalReference(reference: ExternalCreativeReference): string[] {
  const errors: string[] = [];
  for (const key of ["source", "sourceType", "mechanism", "principleExtracted", "projectSpecificUse", "brandSpecificTransformation", "license", "performanceRisk", "accessibilityRisk", "originalityRisk"] as const)
    if (!reference[key] || String(reference[key]).trim().length < 3) errors.push(`${key} is required`);
  if (reference.attributionRequired === null) errors.push("attributionRequired must be resolved");
  if (reference.plannedDifferences.length === 0) errors.push("plannedDifferences must explain how the result remains distinct");
  if (new Set(reference.transformations).size < 3) errors.push("external work must be transformed across at least three dimensions");
  if (/react[- ]bits/i.test(reference.source) && reference.redistributedWithDreative) errors.push("React Bits source must not be redistributed with Dreative");
  return errors;
}

export interface CreativeDeliverySummary {
  ambition: CreativeAmbition; sectionMechanisms: { section: string; mechanisms: string[]; role: "peak" | "transition" | "rest" | "utility" }[];
  heroSection: string; motionVocabulary: string[]; installedAdvancedPackages: string[]; usedAdvancedPackages: string[]; externalReferences: ExternalCreativeReference[];
}

export interface TreatmentHierarchy {
  continuityOwner: SpecialistSkill | "none";
  primaryMotionLanguage: string;
  primaryMaterialLanguage: string;
  primarySpatialLogic: string;
  sections: { section: string; role: "preparation" | "peak" | "transition" | "rest" | "resolution"; dominant: SpecialistSkill[]; supporting: SpecialistSkill[] }[];
  tensionResolutions: string[];
}

export function allocateTreatmentHierarchy(selected: SpecialistSkill[], sectionNames: string[]): TreatmentHierarchy {
  const chosen = new Set(selected); const sections = sectionNames.length ? sectionNames : ["opening", "development", "peak", "rest", "resolution"];
  const pattern: { role: TreatmentHierarchy["sections"][number]["role"]; candidates: SpecialistSkill[] }[] = [
    { role: "preparation", candidates: ["refined", "media"] }, { role: "transition", candidates: ["motion", "immersive"] },
    { role: "peak", candidates: ["experimental", "3d"] }, { role: "rest", candidates: ["refined", "ux"] },
    { role: "resolution", candidates: ["cinematic", "interaction"] },
  ];
  const allocated = sections.map((section, index) => {
    const slot = pattern[index % pattern.length];
    return { section, role: slot.role, dominant: slot.candidates.filter((item) => chosen.has(item)).slice(0, 2), supporting: [] as SpecialistSkill[] };
  });
  for (const treatment of selected) {
    if (allocated.some((item) => item.dominant.includes(treatment) || item.supporting.includes(treatment))) continue;
    const target = allocated.find((item) => item.supporting.length < 2) ?? allocated[allocated.length - 1];
    target.supporting.push(treatment);
  }
  return {
    continuityOwner: chosen.has("immersive") ? "immersive" : chosen.has("cinematic") ? "cinematic" : chosen.has("motion") ? "motion" : "none",
    primaryMotionLanguage: chosen.has("motion") ? "one normalized structural timeline language" : "native state transitions",
    primaryMaterialLanguage: chosen.has("media") ? "project-media material transformation" : "refined project surface system",
    primarySpatialLogic: chosen.has("3d") ? "one bounded depth and occlusion system at selected peaks" : "DOM depth and shared-element continuity",
    sections: allocated,
    tensionResolutions: [
      "Refined disciplines type, spacing and rest states while Experimental is limited to selected peaks.",
      "3D density yields to measured DPR, object and mobile budgets.",
      "Immersive continuity preserves fast navigation and readable DOM landmarks.",
      "Cinematic pacing includes skippable or shortened mobile paths.",
      "Fine-pointer Interaction receives touch and keyboard translations.",
      "Media-heavy sections stage loading and use posters, derivatives and low-power fallbacks.",
      "Lenis remains optional; native accessibility expectations win unless a selected mechanism needs a shared interpolated clock.",
    ],
  };
}

export function validateCreativeDelivery(delivery: CreativeDeliverySummary): string[] {
  const findings: string[] = delivery.externalReferences.flatMap((item) => validateExternalReference(item).map((error) => `${item.source}: ${error}`));
  if (["award", "experimental"].includes(delivery.ambition)) {
    const substantive = delivery.sectionMechanisms.filter((item) => item.role !== "rest" && item.role !== "utility" && item.mechanisms.length);
    if (!substantive.some((item) => item.section !== delivery.heroSection)) findings.push("hero-only motion is not an Award or Experimental delivery");
    if (delivery.motionVocabulary.length === 0 || delivery.motionVocabulary.every((item) => /^(fade|fade-up|opacity|translate|slide|scale)$/i.test(item))) findings.push("fade-only motion is not an Award or Experimental delivery");
    if (delivery.sectionMechanisms.some((item) => item.mechanisms.length > 3)) findings.push("component soup: a section has more than three competing mechanisms");
  }
  for (const packageName of delivery.installedAdvancedPackages) if (!delivery.usedAdvancedPackages.includes(packageName)) findings.push(`installed advanced dependency is unused: ${packageName}`);
  return findings;
}

export interface CreativeStackResolution { scrollOwner: "native" | "lenis"; timelineEngine: "native" | "gsap"; packageProfiles: PackageProfile[]; installCommands: string[]; fallbacks: string[]; blockers: string[]; }
export function resolveCreativeStack(mechanismIds: string[], options: { installed?: string[]; installationAllowed?: boolean; capabilities?: string[] } = {}): CreativeStackResolution {
  const mechanisms = mechanismIds.map((id) => CREATIVE_MECHANISMS.find((item) => item.id === id)).filter((item): item is CreativeMechanism => Boolean(item));
  const unknown = mechanismIds.filter((id) => !mechanisms.some((item) => item.id === id));
  const requested = new Set(mechanisms.flatMap((item) => item.packageProfiles));
  const needsLenis = requested.has("lenis");
  const needsGsap = [...requested].some((id) => id === "gsap" || id.startsWith("gsap-"));
  const installed = new Set(options.installed ?? []); const capabilities = new Set(options.capabilities ?? []);
  const selectedProfiles = PACKAGE_PROFILES.filter((item) => requested.has(item.id));
  const missing = selectedProfiles.filter((item) => !installed.has(item.packageName));
  const blockers = unknown.map((id) => `unknown mechanism ${id}`); const fallbacks: string[] = [];
  for (const item of missing) {
    if (["remotion", "remotion-cli"].includes(item.id) && !capabilities.has("remotion-renderer")) {
      blockers.push(`${item.id} requires a verified Remotion renderer; package presence or permission alone is not capability evidence`);
      fallbacks.push("Use supplied footage, deterministic Canvas/SVG states, or a confirmed FFmpeg/frame-sequence route.");
    } else if (options.installationAllowed === false) fallbacks.push(`${item.id}: use the mechanism's approved native, static or pre-rendered fallback and record the failed precondition.`);
  }
  return {
    scrollOwner: needsLenis ? "lenis" : "native", timelineEngine: needsGsap ? "gsap" : "native", packageProfiles: selectedProfiles,
    installCommands: options.installationAllowed === false ? [] : [...new Set(missing.map((item) => item.install))], fallbacks, blockers,
  };
}

export function searchCreativeCatalog(query: string): CreativeMechanism[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return CREATIVE_MECHANISMS.map((item) => ({ item, score: terms.reduce((score, term) => score + [item.id, item.name, ...item.aliases, item.summary, item.visualOutcome].join(" ").toLowerCase().split(term).length - 1, 0) }))
    .filter(({ score }) => score > 0).sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name)).map(({ item }) => item);
}

export function validateCreativeCatalog(): string[] {
  const errors: string[] = []; const profileIds = new Set(PACKAGE_PROFILES.map((item) => item.id)); const primitiveIds = new Set(CREATIVE_PRIMITIVES.map((item) => item.id)); const exemplarIds = new Set(CREATIVE_EXEMPLARS.map((item) => item.id));
  if (new Set(CREATIVE_MECHANISMS.map((item) => item.id)).size !== CREATIVE_MECHANISMS.length) errors.push("mechanism IDs must be unique");
  for (const item of CREATIVE_MECHANISMS) {
    for (const id of item.packageProfiles) if (!profileIds.has(id)) errors.push(`${item.id}: unknown package profile ${id}`);
    if (!primitiveIds.has(item.primitive)) errors.push(`${item.id}: unknown primitive ${item.primitive}`);
    if (item.exemplar && !exemplarIds.has(item.exemplar)) errors.push(`${item.id}: unknown exemplar ${item.exemplar}`);
    if (!item.recipe.startsWith("recipes/") || !item.semanticFallback || !item.reducedMotionStrategy || !item.mobileTranslation || !item.requiredEvidence.length) errors.push(`${item.id}: incomplete delivery contract`);
    if (!item.references.every((ref) => ref.source && ref.license && typeof ref.attributionRequired === "boolean")) errors.push(`${item.id}: incomplete reference licensing`);
  }
  for (const item of CREATIVE_PRIMITIVES) for (const id of item.packageProfiles) if (!profileIds.has(id)) errors.push(`${item.id}: unknown package profile ${id}`);
  for (const item of CREATIVE_EXEMPLARS) {
    for (const id of item.mechanismIds) if (!CREATIVE_MECHANISMS.some((mechanism) => mechanism.id === id)) errors.push(`${item.id}: unknown mechanism ${id}`);
    for (const id of item.primitiveIds) if (!primitiveIds.has(id)) errors.push(`${item.id}: unknown primitive ${id}`);
    for (const id of item.packageProfiles) if (!profileIds.has(id)) errors.push(`${item.id}: unknown package profile ${id}`);
  }
  return errors;
}

export function renderAgentCatalogue(query?: string): string {
  const entries = query ? searchCreativeCatalog(query) : CREATIVE_MECHANISMS;
  return [
    "# Dreative creative mechanism catalogue", "", "Search: `dreative catalogue --query \"image tornado\" --json`", "",
    ...entries.flatMap((item) => [`## ${item.name} (${item.id})`, `Aliases: ${item.aliases.join(", ") || "none"}`, `Purpose: ${item.visualOutcome}`, `Packages: ${item.packageProfiles.join(", ") || "native-first"}`, `Primitive: ${item.primitive}`, `Recipe: ${item.recipe}`, `Fallback: ${item.semanticFallback}`, `Evidence: ${item.requiredEvidence.join(", ")}`, ""]),
  ].join("\n");
}
