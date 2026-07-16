export type MechanismFamily =
  | "media-fragmentation-reconstruction"
  | "scroll-controlled-sequence"
  | "persistent-spatial-prop"
  | "spatial-product-exploration"
  | "cinematic-scene-transition"
  | "shader-material-transformation"
  | "experimental-typography";

export interface ExperimentalMechanismRecipe {
  id: string;
  family: MechanismFamily;
  creativeUseCase: string;
  requiredAssets: string[];
  requiredPackages: string[];
  requiredAuthoringTools: string[];
  worksWithoutSpecializedTool: boolean;
  performanceRisk: string;
  mobileStrategy: string;
  reducedMotionStrategy: string;
  fallback: string;
  prototypeRequirement: string;
  substantiveDelivery: string[];
  insufficientDelivery: string[];
  verificationStates: string[];
}

export const EXPERIMENTAL_MECHANISMS: ExperimentalMechanismRecipe[] = [
  {
    id: "fragment-reconstruction",
    family: "media-fragmentation-reconstruction",
    creativeUseCase: "Break one meaningful image into authored fragments, tiles, slices or particles and reconstruct it into the next chapter.",
    requiredAssets: ["source media", "optional mask or atlas", "production derivatives"],
    requiredPackages: [],
    requiredAuthoringTools: ["image editing for masks or atlas when the source cannot be segmented at runtime"],
    worksWithoutSpecializedTool: true,
    performanceRisk: "Fragment count, texture size and DOM/WebGL handoff can raise memory and frame time.",
    mobileStrategy: "Reduce fragment count and depth while preserving separation, midpoint and reconstruction.",
    reducedMotionStrategy: "Present semantic intact, separated and reconstructed states without continuous travel.",
    fallback: "Masked slices or a short pre-rendered sequence preserving the same transformation.",
    prototypeRequirement: "Prototype when fragment count, WebGL handoff or source identity is unresolved.",
    substantiveDelivery: ["Source pixels visibly separate and rebuild.", "Start, active and resolved states differ structurally."],
    insufficientDelivery: ["Decorative particles over an unchanged image.", "Opacity fade between two flat rectangles."],
    verificationStates: ["intact", "fragmented-midpoint", "reconstructed", "mobile", "reduced-motion"],
  },
  {
    id: "scrubbed-frame-sequence",
    family: "scroll-controlled-sequence",
    creativeUseCase: "Map controlled scroll progress to a coherent sourced, generated or rendered image sequence.",
    requiredAssets: ["numbered frame set", "poster", "mobile reduced frame set"],
    requiredPackages: [],
    requiredAuthoringTools: ["frame production or sourcing", "optional FFmpeg or image tooling for compilation and optimization"],
    worksWithoutSpecializedTool: false,
    performanceRisk: "Eager loading, decode memory and frame drops can exceed route budgets.",
    mobileStrategy: "Use a smaller crop and reduced frame count with bounded staged decoding.",
    reducedMotionStrategy: "Show a meaningful poster and final state with the narrative change intact.",
    fallback: "Short optimized video or three controlled semantic states after an evidenced decode/runtime failure.",
    prototypeRequirement: "Prototype frame loading, progress mapping and release lifecycle as a distinct risk family.",
    substantiveDelivery: ["Scroll controls more than three coherent visual states.", "Loading, poster and resolved states are observable."],
    insufficientDelivery: ["Three tabs swapping still images.", "All frames loaded eagerly on route start."],
    verificationStates: ["loading", "early", "middle", "final", "scroll-release", "mobile", "reduced-motion"],
  },
  {
    id: "persistent-spatial-prop",
    family: "persistent-spatial-prop",
    creativeUseCase: "Carry a model, spatial cutout, billboard or media plane across chapters while scale, lighting, orientation and role evolve.",
    requiredAssets: ["model or classified spatial substitute", "poster or semantic fallback"],
    requiredPackages: ["three when WebGL staging is selected"],
    requiredAuthoringTools: ["3D authoring only when a bespoke model is promised; cutout staging can work without it"],
    worksWithoutSpecializedTool: true,
    performanceRisk: "One persistent canvas can leak lifecycle state or overdraw on low-power devices.",
    mobileStrategy: "Shorten travel, cap DPR and keep the prop clear of reading and controls.",
    reducedMotionStrategy: "Use chapter-specific still compositions with equivalent role progression.",
    fallback: "Layered spatial cutout or WebGL media plane; static fallback only for runtime or accessibility requirements.",
    prototypeRequirement: "Prototype cross-section ownership, occlusion and cleanup when the stage persists.",
    substantiveDelivery: ["Prop appears in multiple chapters.", "Depth, lighting, occlusion or perspective visibly changes."],
    insufficientDelivery: ["The prop exists only in the hero.", "A flat image is translated over static sections."],
    verificationStates: ["hero-role", "handoff", "downstream-role", "resolution", "mobile", "low-power", "reduced-motion"],
  },
  {
    id: "spatial-product-constellation",
    family: "spatial-product-exploration",
    creativeUseCase: "Arrange products in orbit, depth or a constellation and move the active subject into a detailed dossier.",
    requiredAssets: ["distinct product media", "detail content", "conventional list fallback"],
    requiredPackages: [],
    requiredAuthoringTools: [],
    worksWithoutSpecializedTool: true,
    performanceRisk: "Drag physics and large product media can harm control and mobile responsiveness.",
    mobileStrategy: "Use bounded swipe/scrub navigation and a visible conventional list alternative.",
    reducedMotionStrategy: "Use discrete spatial states with focus movement rather than continuous orbit.",
    fallback: "Accessible depth-based list preserving spatial selection, not an unapproved basic carousel.",
    prototypeRequirement: "Prototype drag/scrub mapping and keyboard equivalence as an interaction risk family.",
    substantiveDelivery: ["Input changes viewpoint or spatial arrangement.", "Active product travels into a distinct detail state."],
    insufficientDelivery: ["Standard buttons replacing the spatial model.", "A conventional carousel with no approved change."],
    verificationStates: ["resting-constellation", "active-drag", "selected-dossier", "keyboard", "touch", "fallback"],
  },
  {
    id: "chapter-match-cut",
    family: "cinematic-scene-transition",
    creativeUseCase: "Use camera, foreground reveal, media-plane transformation, lighting progression or shape match to hand one chapter into another.",
    requiredAssets: ["related scene media or geometry", "handoff states"],
    requiredPackages: [],
    requiredAuthoringTools: [],
    worksWithoutSpecializedTool: true,
    performanceRisk: "Long pinned timelines and competing scroll owners can damage control.",
    mobileStrategy: "Shorten the transition and preserve the exact cause-and-effect handoff.",
    reducedMotionStrategy: "Use an immediate match composition and stable reading order.",
    fallback: "A shorter controlled scene handoff after measured lifecycle or performance failure.",
    prototypeRequirement: "Prototype when several sections share one timeline or handoff owner.",
    substantiveDelivery: ["One scene visibly becomes or reveals the next.", "Peak/rest pacing is observable across sections."],
    insufficientDelivery: ["Dark palette and large headings.", "Independent entrance fades with no handoff."],
    verificationStates: ["source-scene", "handoff-midpoint", "destination-scene", "reverse-when-promised", "mobile"],
  },
  {
    id: "material-state-transformation",
    family: "shader-material-transformation",
    creativeUseCase: "Change burn, roast, weather, liquid, grain, smoke, refraction or depth-map material state in response to scroll or input.",
    requiredAssets: ["source texture", "optional depth, displacement or mask maps"],
    requiredPackages: ["three only when a Three.js material is selected"],
    requiredAuthoringTools: ["image editing for authored maps when procedural maps are insufficient"],
    worksWithoutSpecializedTool: true,
    performanceRisk: "Large textures, excessive DPR and expensive fragment work can exceed GPU budgets.",
    mobileStrategy: "Lower texture dimensions, cap DPR and simplify shader passes while preserving material change.",
    reducedMotionStrategy: "Show authored before and after material states.",
    fallback: "Pre-rendered states or a short sequence after evidenced GPU/runtime failure.",
    prototypeRequirement: "Prototype visual legibility and frame time for the exact material change.",
    substantiveDelivery: ["The media material visibly changes internally.", "Input or scroll controls a meaningful material state."],
    insufficientDelivery: ["Scaling a flat image.", "Noise layered above unchanged media."],
    verificationStates: ["material-start", "material-active", "material-resolved", "performance", "mobile", "fallback"],
  },
  {
    id: "reassembled-spatial-type",
    family: "experimental-typography",
    creativeUseCase: "Let letters fragment, become masks or geometry, change hierarchy, or participate in scene depth as the narrative develops.",
    requiredAssets: ["licensed variable or display font", "optional glyph geometry or masks"],
    requiredPackages: [],
    requiredAuthoringTools: [],
    worksWithoutSpecializedTool: true,
    performanceRisk: "Per-glyph DOM or geometry can create layout, accessibility and rendering cost.",
    mobileStrategy: "Reduce glyph count and depth while keeping reading order and hierarchy change.",
    reducedMotionStrategy: "Present the resolved authored heading with semantic text intact.",
    fallback: "Masked or variable-font states preserving the hierarchy transformation.",
    prototypeRequirement: "Prototype when glyph geometry, masking or layout measurement is unresolved.",
    substantiveDelivery: ["Typography changes hierarchy or participates in the scene.", "Semantic text remains accessible."],
    insufficientDelivery: ["Random letter jitter.", "A display font with entrance animation only."],
    verificationStates: ["readable-start", "active-reassembly", "resolved-hierarchy", "mobile", "reduced-motion"],
  },
];

export function mechanismRecipe(id: string): ExperimentalMechanismRecipe {
  const recipe = EXPERIMENTAL_MECHANISMS.find((item) => item.id === id);
  if (!recipe) throw new Error(`unknown experimental mechanism ${id}`);
  return recipe;
}
