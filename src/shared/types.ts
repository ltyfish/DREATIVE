export type BlockType =
  | "section"
  | "row"
  | "column"
  | "nav"
  | "hero"
  | "card-grid"
  | "list"
  | "form"
  | "footer"
  | "text"
  | "image"
  | "button";

export interface Block {
  id: string;
  type: BlockType;
  label: string;
  /** real visible copy from the app (heading, button caption, ~80 chars) — rendered in the wireframe */
  text?: string;
  direction?: "row" | "column";
  sizeHint?: "sm" | "md" | "lg";
  intents?: string[];
  /** one-line "what this element shows/does" written by the extracting agent — surfaces on hover in wireframe + replica */
  summary?: string;
  /** relative path under .dreative/, e.g. "refs/pg1_blk3.png" — style reference for this block */
  refImage?: string;
  /** where this block lives in the real codebase, e.g. "src/components/Nav.tsx" — set by extraction */
  source?: string;
  children?: Block[];
}

/** Rough look of the real app so wireframes read as "your site" (CSS colors). */
export interface PageTheme {
  /** page background, e.g. "#0d0d0f" */
  bg?: string;
  /** text/line color, e.g. "#e8e8ea" */
  fg?: string;
  /** brand accent for buttons/highlights, e.g. "#f59e0b" */
  accent?: string;
}

export type TransformationDepth = "restyle" | "relayout" | "restructure" | "reimagine";
export type SourceStrategy = "patch" | "recompose" | "rebuild-from-contracts";
export type PageRegister =
  | "marketing-storytelling"
  | "discovery-browse"
  | "task-transaction"
  | "account-status"
  | "administration"
  | "data-dense-utility"
  | "authentication"
  | "system-state";

export interface StructuralDelta {
  existingModel: string;
  proposedModel: string;
  existingParadigm: string;
  proposedParadigm: string;
  materialChanges: string[];
  survivingBoundaries: string[];
  rebuiltBoundaries: string[];
  preservedContracts: string[];
  retainedPatterns: { pattern: string; rationale: string }[];
  forbiddenCarryovers: string[];
  depthHonesty: string;
}

export interface MobileBlueprint {
  primaryTask: string;
  firstViewportPurpose: string;
  contentOrder: string[];
  beforeFirstScroll: string[];
  primaryThumbAction: { action: string; placement: string };
  stickyElements: string[];
  safeArea: string;
  navigationModel: string;
  mobileOnlyComposition: string;
  desktopTranslation: {
    retained: string[];
    translated: string[];
    removed: string[];
    replaced: string[];
  };
  mediaStrategy: string;
  motionStrategy: string;
  keyboardAndForms: string;
  composition390: string;
  fallback320: string;
  stackingRejection: string;
  verificationChecks: MobileVerificationCheck[];
}

export type MobileVerificationCheck =
  | "no-horizontal-overflow"
  | "no-clipped-content"
  | "fixed-elements-clear-content"
  | "safe-area-spacing"
  | "primary-task-discoverable"
  | "primary-action-reachable"
  | "touch-targets"
  | "software-keyboard-usable"
  | "no-hover-only"
  | "intentional-mobile-composition"
  | "mobile-content-order"
  | "motion-media-translated"
  | "no-decorative-task-blocker";

export interface ExpressionContract {
  mechanism: string;
  communicates: string;
  projectFit: string;
  location: string;
  mobileTranslation: string;
  reducedMotion: string;
  fallback: string;
  verification: string;
}

export interface Page {
  id: string;
  name: string;
  /** screen this view belongs to when one route was split into multiple views (tabs/modes), e.g. "Admin Studio" */
  group?: string;
  theme?: PageTheme;
  canvasPos: { x: number; y: number };
  status: "skeleton" | "designed";
  refImage?: string;
  designPrompt?: string;
  layout: Block;
  generatedFile?: string;
  /** stripped, non-functional 1:1 replica of the real page (static JSX), relative to .dreative/, e.g. "replica/pg_home.tsx" */
  replicaFile?: string;
  /** file/route in the real codebase this page came from — set by extraction */
  source?: string;
}

/** Project-wide design direction, edited in the UI and passed to the agent
 *  with every propose/design request. */
export interface DesignBrief {
  /** aesthetic preset: minimal | editorial | premium | playful | brutalist | dark-tech | trust */
  aesthetic?: string;
  /** free project-specific vibe words, e.g. "calm, precise, tactile" */
  vibe?: string;
  /** who the UI is for, e.g. "technical buyers" */
  audience?: string;
  /** 1-10: layout symmetry → asymmetric experimentation */
  variance?: number;
  /** 1-10: static → cinematic motion */
  motion?: number;
  /** 1-10: airy → packed */
  density?: number;
  /** independent redesign depth; does not imply an ambition tier */
  transformationDepth?: TransformationDepth;
  notes?: string;
}

export interface Project {
  version: 1;
  brief?: DesignBrief;
  pages: Page[];
}
