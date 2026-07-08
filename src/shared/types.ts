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
  direction?: "row" | "column";
  sizeHint?: "sm" | "md" | "lg";
  intents?: string[];
  /** relative path under .dreative/, e.g. "refs/pg1_blk3.png" — style reference for this block */
  refImage?: string;
  children?: Block[];
}

export interface Page {
  id: string;
  name: string;
  canvasPos: { x: number; y: number };
  status: "skeleton" | "designed";
  refImage?: string;
  designPrompt?: string;
  layout: Block;
  generatedFile?: string;
}

export interface Project {
  version: 1;
  pages: Page[];
}
