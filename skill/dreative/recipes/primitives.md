# Original Dreative execution primitives

These are lifecycle and composition contracts, not reusable visual templates.
The authoritative typed records live in `src/shared/creativeCatalog.ts` and are
shipped through the CLI catalogue.

| Primitive | Contract focus |
| --- | --- |
| DreativeScrollClock | one native/Lenis clock; normalized progress, direction, velocity; anchors and modal/nested scroll |
| DreativeGsapScope | React `useGSAP`/vanilla `gsap.context`; stable scope and full revert |
| DreativePinnedChapter | measured pin, reversible progress, refresh after assets, safe release |
| DreativePersistentStage | declared section berths, occlusion ownership, one renderer and semantic fallback |
| DreativeMediaPlane | project pixels, responsive bounds, texture errors, DPR and disposal |
| DreativeVelocityMaterial | clamped velocity, visible peak, crisp settle, reduced-motion state |
| DreativeFragmentField | project-specific segmentation, bounded fragments, recognizable midpoint |
| DreativeParticleReconstruction | progressive loading, bounded particles, subject reconstruction |
| DreativeFrameSequence | manifest, posters, progressive window, missing-frame recovery, responsive variants |
| DreativeSharedElementHandoff | identity, focus, source/destination geometry and renderer ownership |
| DreativeDepthDive | authored layers/map, occlusion, camera path and matched destination |
| DreativeSpatialGallery | bounded navigation, selected dossier, pointer/touch/keyboard parity |
| DreativeKineticType | semantic text, measured glyphs, hierarchy and readable resolution |
| DreativeVideoTexture | poster/readiness/codecs, seek or time control, still fallback and disposal |
| DreativeSceneTransition | adjacent-section cause/effect, reversibility and stable reading order |
| DreativeDragConstellation | bounded inertia, cancellation, keyboard list and mobile snap rail |

Every primitive contract includes loading and asset-error states, resize,
cleanup, reduced motion, mobile translation, semantic DOM fallback, adaptive
performance controls, acceptable degradation, browser checks and initial /
midpoint / peak / end evidence. WebGL implementations dispose renderer,
textures, materials and geometry, cap DPR, pause when hidden and retain DOM or
static-media fallbacks.
