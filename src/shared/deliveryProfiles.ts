export type DeliveryProfileId = "efficient" | "recommended" | "showcase";

export interface DeliveryProfile {
  id: DeliveryProfileId;
  label: string;
  promise: string;
  tradeoff: string;
  workflow: string[];
  verification: string[];
}

export const DELIVERY_PROFILES: readonly DeliveryProfile[] = [
  {
    id: "recommended",
    label: "Recommended",
    promise: "The best balance of originality, product clarity, responsive craft, and delivery time.",
    tradeoff: "Uses one strong visual idea and only the motion, media, or packages that materially improve it.",
    workflow: [
      "Inspect the real product, content, routes, assets, and current design.",
      "Choose one content-specific direction and carry it through every major section.",
      "Build the real page, then refine it from desktop and mobile browser inspection.",
    ],
    verification: ["production build", "1440px and 390px", "key interactions", "console, overflow, and text integrity"],
  },
  {
    id: "efficient",
    label: "Efficient",
    promise: "A focused, professional redesign with the shortest useful path to a finished result.",
    tradeoff: "Keeps the existing stack and favors typography, layout, color, and interaction polish over advanced effects.",
    workflow: [
      "Preserve the current information architecture and working behavior.",
      "Improve hierarchy, typography, spacing, responsive layout, and core states.",
      "Run one focused browser refinement pass.",
    ],
    verification: ["production build", "desktop and mobile", "primary journey", "console and overflow"],
  },
  {
    id: "showcase",
    label: "Showcase",
    promise: "The highest creative ceiling for a flagship, launch, portfolio, or award-oriented experience.",
    tradeoff: "Costs more time and performance budget; advanced motion, media, or 3D must earn its place.",
    workflow: [
      "Develop a distinctive art direction and a clear page-wide experience arc.",
      "Prototype only the single riskiest signature mechanism when feasibility is genuinely uncertain.",
      "Build and refine the full experience, including authored mobile and reduced-motion forms.",
    ],
    verification: ["production build", "1440px, 390px, and 320px", "all important interactions", "performance and reduced motion"],
  },
] as const;

export function renderDeliveryBrief(recommendation: DeliveryProfileId = "recommended"): string {
  const ordered = [
    ...DELIVERY_PROFILES.filter((profile) => profile.id === recommendation),
    ...DELIVERY_PROFILES.filter((profile) => profile.id !== recommendation),
  ];
  const lines = [
    "Dreative approach",
    "",
    ...ordered.flatMap((profile, index) => [
      `${index + 1}. ${profile.label}${profile.id === recommendation ? " — recommended" : ""}`,
      `   ${profile.promise}`,
      `   Tradeoff: ${profile.tradeoff}`,
      "",
    ]),
    "Reply with “use recommended”, “use efficient”, or “use showcase”.",
    "Say “show detailed plan” if you want sections, assets, motion, packages, and verification details before choosing.",
  ];
  return lines.join("\n");
}

export function deliveryProfile(id: DeliveryProfileId): DeliveryProfile {
  const profile = DELIVERY_PROFILES.find((candidate) => candidate.id === id);
  if (!profile) throw new Error(`unknown delivery profile: ${id}`);
  return profile;
}
