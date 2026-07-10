# Dreative Specialist Skill — Refined Clean Business

Load this file when `plan.skills` includes `refined`, or the brief/prompt asks
for a "clean modern business site", premium-but-calm marketing, DTC/e-commerce
polish, "professional, not flashy", or names references like ch.maswitzerland.com
or lovvelavva.com. This is the OPPOSITE pole from immersive/cinematic: quality
expressed through restraint — spacing, photography, and type doing all the work,
with motion barely above zero. Most real client work lands here; treat it as a
craft discipline, not the absence of one.

It EXTENDS DESIGN.md (everything applies; this file tightens the dials). It does
NOT stack with `immersive`/`cinematic` — those are different registers. It pairs
well with a light dose of `interaction` (press states, underline draws) and the
first tier of `motion` (one hero sequence, 2-3 in-view reveals).

## 0. The register: expensive silence

What separates premium-clean from generic-clean is not any element — it's the
ratios:

- **Whitespace is the brand.** Section padding 96-160px desktop / 56-80px
  mobile; content max-width 1200-1320px with WIDE outer gutters; one idea per
  viewport. If a section feels empty, that's the look working — resist filling.
- **Photography carries the emotion.** Real product/lifestyle imagery, art-
  directed to one consistent grade (one light temperature, one background
  family). Full-bleed image sections alternate with contained text sections —
  the rhythm image / text / image IS the page structure. Never decorate around
  weak imagery; demand or generate better imagery instead.
- **Type does hierarchy, color stays out of the way.** Near-monochrome palette:
  warm or cool neutral family + ONE accent used almost exclusively on the
  primary CTA and links. Backgrounds shift between 2-3 tints of the neutral
  (e.g. white / #f6f5f2 / #111) to separate sections without borders.
- **Motion whispers.** Motion dial effectively ≤ 4: fade-rise entrances
  (300-400ms, once), a sticky nav that gains a hairline+blur, underline draws,
  press states. No parallax beyond 4%, no pinning, no canvas. A single
  restrained signature (a slow ken-burns on the hero image, or a marquee of
  press logos) is the ceiling.

## 1. Page anatomy (marketing/DTC form)

The proven skeleton — vary the composition per DESIGN.md §5, not the order
logic:

1. **Hero**: one full-width image or split layout; headline ≤ 8 words stating
   the value in plain language; one CTA. No feature bullets in the hero.
2. **Credibility strip**: press/client logos, real marks, grayscale or
   single-tint (lovvelavva runs Forbes/Women's Health/Real Simple here —
   this section converts and belongs high on DTC pages).
3. **Value sections** (2-4): alternating image/text, each making ONE claim
   with 1-2 sentences of support. Icons only if custom-drawn; three-generic-
   icon-cards is the tell this register must avoid most.
4. **Product/collection grid**: large images, generous gaps (24-32px), minimal
   card chrome — image, name, price/one-liner; hover = image swap or subtle
   zoom-crop INSIDE a fixed frame (no card growth).
5. **Social proof**: 1-3 real testimonials with names/photos, editorial layout
   (big quote type), never a 3-card testimonial row.
6. **Closing CTA**: calm full-width section, one sentence, one button.
7. **Footer**: structured, generous, quiet — the footer's polish is a trust
   signal in this register; give it real columns, legal, newsletter.

E-commerce specifics: sticky add-to-cart on product pages (mobile bottom bar),
price always visible, shipping/returns reassurance near the CTA, cart as a
slide-over drawer not a page.

## 2. The discovery-grid variant (cosmos.so-like)

For content/discovery products (galleries, moodboards, catalogs): near-zero
chrome around a masonry/justified image grid; dark or paper-white surface;
images at native aspect ratios (never uniform crops); hover = slight lift +
metadata fade-in on top of the image; infinite scroll with a sentinel loader;
the search/filter bar is the only persistent UI. The product IS the grid —
navigation, branding, and controls stay almost invisible until needed.

## 3. What "modern" means here (2024+, not 2016 flat)

- Hairline borders (1px, 8-12% alpha) instead of shadows for structure; the
  2-3 stacked tinted shadows (interaction.md §3) reserved for genuinely
  floating elements (dropdowns, drawers).
- Larger type than feels safe: body 17-18px on marketing pages, display
  clamped 2.5-4.5rem, tight leading. Small timid type is the #1 dated tell.
- Radius system: one value family — either near-square (2-4px, editorial/
  luxury) or soft (12-16px, DTC/consumer) — never mixed.
- Buttons: solid accent primary + quiet text-link secondary. Pill shape only
  in the consumer/DTC variant. No outlined-button armies.
- Real `<img>`/`<picture>` with proper aspect-ratio boxes; no CSS-drawn
  product mockups; `object-fit: cover` with art-directed focal points.

## 4. Guardrails

- If you're adding an effect to make a section interesting, the section's
  content or imagery is the problem — fix that instead.
- No gradient meshes, no glassmorphism cards, no floating blob backgrounds,
  no emoji in UI copy: all instantly cheapen this register.
- Accessibility floor is easy here — don't squander it: AA contrast on the
  tinted neutrals (test the #767676-gray-on-white trap), visible focus,
  semantic landmarks.
- Performance IS the aesthetic: LCP image preloaded, fonts ≤ 2 files,
  zero animation libraries unless motion is actually used — a clean site
  that loads instantly reads as more premium than any effect.
