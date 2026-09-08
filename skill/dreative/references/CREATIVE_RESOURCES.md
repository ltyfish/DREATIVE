# Targeted creative resource lookup

Use this only for a concrete gap. These are discovery routes, not preferred
styles, mandatory dependencies, or guarantees of quality. Open the relevant
current documentation and actual example before adopting it. Check framework,
license/access, asset availability, and behavior in the target environment.

## Find an experience or interaction

- [Recent Design](https://recent.design), [Godly](https://godly.website),
  [Refero](https://refero.design), and [Appshots](https://appshots.design): scout
  composition or real product flows, then inspect the original experience.
  Screenshots cannot establish timing or provide rights to depicted assets.
- [Emil Kowalski](https://emilkowal.ski/skill): focused interaction, animation
  review, and prototyping guidance. [Impeccable](https://impeccable.style):
  focused design diagnosis. [MengTo](https://github.com/MengTo/Skills): specialist
  design/Three.js workflows. Consult the relevant technique when needed; do not
  merge whole skill collections, their aesthetic defaults, or gate systems.

## Adapt a primitive

For transitions that change the composition rather than decorate an entrance,
start from a specific mechanism and inspect its actual demo/source:

- [Codrops image expansion within typography](https://tympanus.net/codrops/2024/04/02/on-scroll-expanding-image-animation-within-typography/):
  study how image space and type displacement share a composition. Adapt the
  relationships and responsive wrapping; the article's media is not a reusable
  asset pack. [Source](https://github.com/codrops/ImageExpansionTypography).
- [GSAP Flip](https://gsap.com/docs/v3/Plugins/Flip/): measured transitions
  between layouts, useful for image-to-detail and collection reorganization.
  Inspect interrupted transitions and source/destination ownership.
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/): scope
  animation setup and reversion to viewport and reduced-motion conditions.
  Choose a mobile composition; a breakpoint API cannot design it.

These are implementation references, not proof of a site's full-route pacing.
Use `CHOREOGRAPHY.md` to decide what needs to connect before selecting a demo.

| Need | Candidates | Adoption decision |
|---|---|---|
| Expressive React interaction | [Skiper](https://skiper-ui.com), [Aceternity](https://ui.aceternity.com), [Kokonut](https://kokonutui.com), [Lukacho](https://ui.lukacho.com), [Watermelon](https://ui.watermelon.sh) | Inspect the chosen source, replace demo content, own responsive/focus/exit behavior and animation cleanup |
| Small CSS/UI treatment | [Uiverse](https://uiverse.io) | Check the individual snippet and license; preserve semantic controls |
| Charts/data expression | [Bklit](https://bklit.com) | Use for a data experience; verify actual values, interaction, and accessible alternative |
| Premium motion components | [UILORA](https://www.uilora.com), [AnimMaster](https://animmasterlib.dev) | Verify access and license for the project; do not redistribute paid component source inside this skill |

Borrow the smallest useful implementation. Adapt scale, type, material, pace,
input, and handoff so the primitive belongs to this project. A functioning demo
does not prove mobile usability, interruptibility, performance, or originality.

## Render or author material

- [Motion](https://motion.dev), [Anime.js](https://animejs.com), GSAP, and native
  browser animation: choose by orchestration needs in `CREATIVE_EXECUTION.md`.
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber): React scene
  rendering when spatial material or custom shaders justify it; it does not
  supply the intended model, camera, lighting, or art direction.
- [Spline](https://docs.spline.design/exporting-your-scene/web/exporting-as-code):
  author or use an actual scene and inspect the export mode. Event/animation
  support differs by export; a runtime install is not a created scene.
- [ShaderGradient](https://shadergradient.co),
  [Paper liquid logo](https://github.com/paper-design/liquid-logo), and
  [liquid-glass-js](https://github.com/dashersw/liquid-glass-js): targeted material
  treatments. Test the actual background, edges, text contrast, reduced motion,
  compositing cost, and fallback. Glass and gradients are not global defaults.
- [Particles](https://particles.casberry.in): an experimental authoring/export
  candidate. Inspect the exported artifact and rights before choosing it; an
  export button or marketing demo does not prove integration or performance.
- Available image/video generators or [Manus design tools](https://www.manus.im/tools/ai-design):
  asset-production candidates when callable and authorized. Probe the real tool,
  output formats, cost, and edit/reference support. Follow `MEDIA_SOURCES.md`;
  a service website is not evidence that this agent can operate its API.

## Stop at a useful result

Compare the prototype to the intended visual and interaction outcome. Keep a
successful asset/primitive and its source locally; avoid repeating discovery.
When a route fails, name the failed property and switch the relevant production
method. Do not respond to poor framing by installing another animation library.
