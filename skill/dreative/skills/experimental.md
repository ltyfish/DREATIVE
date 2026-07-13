# Dreative Specialist Skill — Experimental / Creative-Mindset Dial

## Contract

Follow `../references/SKILL_CONTRACT.md`. Dependencies: `motion`, `interaction`,
`media`, `ux`, `mobile`. Explore one named provocation per major section, then
select only the strongest two or three to ship. Do not load as a synonym for
visual quality. Done means the selected peaks are visibly implemented while the
remaining sections prepare, support, contrast, transform, or rest; navigation,
reading, touch, and reduced motion remain clear.

Load this file when `plan.skills` includes `experimental`, or the brief asks for
"crazy", "bizarre", "never seen before", "way more creative", "wow factor", or
stacks award-site ambition with 3d/immersive/cinematic and clearly wants the
result to go further than a competent, safe execution of those genres.

This file is not a genre on its own — it STACKS with `motion.md`, `3d.md`,
`immersive.md`, `cinematic.md`, `media.md`. It is a mindset correction for a
specific, recurring failure: builds that hit every named treatment competently
but still read as *effects placed on a static page* rather than a page that
*behaves* differently as you move through it. The gap between those two is
where the top-tier reference sites (PLAN.md's calibration list) actually live.

## 0. See the whole scroll, not one frame at a time

The most common miss: designing each section as a still composition and then
bolting particles/parallax onto it, instead of asking what the SAME asset does
across its entire scroll range.

- Before writing a section, sketch its motion as a **timeline, not a pose**:
  what does this look like at scroll 0%, 40%, 100%? An image that is static at
  every one of those points and only has particles drifting in front of it has
  not been treated — the particles are decoration, not behavior.
- Prefer techniques where the ASSET ITSELF changes: a photo that dissolves into
  its constituent color field and reassembles as a different crop; a product
  render that the camera physically orbits as you scroll, revealing a side you
  hadn't seen; a shader that reads scroll velocity and warps/refracts the media
  plane harder the faster you scroll, settling to true crispness only at rest.
- Treat interaction inputs (scroll, cursor, drag, time-idle) as free stagehands,
  not one-off triggers: the same input should be able to drive multiple things
  at once (camera position AND grain intensity AND type kerning) so the page
  feels like one system reacting, not independent effects that happen to share
  a page.

## 1. Texture and material, not smooth plain geometry

A 3D object with default lighting and a flat color material reads as a stock
asset even when it renders and animates cleanly. Before shipping any custom 3D
element:

- Give it a **material identity**: roughness/metalness maps, a normal map or
  procedural bump (even a cheap noise-driven `onBeforeCompile`/shader tweak),
  fresnel/rim light, or a physically-motivated finish (brushed metal, wet
  ceramic, frosted glass, matte paper) — pick ONE that fits the brand and
  commit, rather than leaving `MeshStandardMaterial` defaults.
- Light it like a product shot, not a demo scene: a key light + rim light +
  soft fill, an environment map (even a cheap generated HDRI/gradient cubemap)
  for reflections — flat ambient-only lighting is what makes geometry look
  "plain" even when the model is good.
- If the model IS meant to look clean/minimal (a deliberate register choice),
  say so explicitly in the plan — plainness should be a decision, not the
  default outcome of skipping material work.

## 2. Dimension shifts as a real technique, not just camera dolly

"Zoom when I scroll" and "go different 3D dimensions and views" point at scroll
or interaction driving genuine viewpoint change, beyond the immersive.md scroll-
as-travel camera path:

- **Depth dive**: scroll or click zooms PAST the current plane into a nested
  scene (a product card's texture becomes the next section's background at
  full zoom — one continuous zoom, not a cut).
- **Orbit reveal**: dragging or scroll-linked rotation swings the camera around
  a subject to a genuinely different vantage (front → 3/4 → side), timed to
  reveal new content at each stop rather than just spinning for spectacle.
- **World swap**: a full scene transition where the "rules" change (palette
  inverts, gravity/particle behavior flips, camera projection shifts from
  perspective to a flattened orthographic beat) — used sparingly, at most once
  or twice per page, as a structural beat (e.g. between "problem" and
  "solution" sections), not as constant novelty.
- Every dimension shift still obeys immersive.md §2's rule: something must
  persist across the cut (the subject, the camera, a color) or it reads as a
  jarring reload, not a journey.

## 3. Explore broadly, ship a hierarchy

Competent execution of the named treatments is the floor, not the ceiling.
When the user has opted into `experimental`:

- For each blueprint row, after picking its treatment(s), ask "what is the
  ONE non-obvious version of this?" and write it down even if it's risky — a
  gallery that disperses into a particle field and reforms as the next item
  instead of a slide/fade; a form where each correct field entry visibly
  feeds a growing 3D structure; a footer that only fully renders once you've
  scrolled back UP to summon it. Not every idea survives the fallback
  requirement (PLAN.md §2), but `experimentalPlan.candidates` should contain at
  least one per major section, not zero.
- Select only the strongest two or three candidates to ship. Every unselected
  section receives an explicit supporting role: prepare a peak, rest after it,
  contrast it, carry connective tissue, or transform its residue. Experimental
  means hierarchy and surprise, not every section competing as a technical demo.
- Reference sites should be read as **systems to extract principles from**,
  not screenshots to imitate: note what makes their asset behave (a shader
  uniform driven by scroll velocity, a shared depth-of-field across the whole
  scene, type that occludes/is-occluded by 3D subjects) and reapply the
  PRINCIPLE to Northwind/the actual brand — copying their literal palette or
  layout without the underlying system produces exactly the "images still
  static, objects still plain" outcome this file exists to prevent.
- Every ambitious idea still needs 3d.md §5 / motion.md §5 performance
  budgets and a concrete fallback (PLAN.md §2) — experimental means bolder
  ideas, not exemption from the runtime verification gate.
