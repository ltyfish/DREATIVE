# Immersive implementation recipes

Load after three world concepts are recorded; log access in `recipeAccess`.

- **Persistent stage:** root canvas/DOM stage plus route-published scene states;
  tween between states without remounting the world.
- **Scroll journey:** tall semantic DOM chapters drive damped camera/material/
  media state; expose chapter navigation and keep copy selectable.
- **Shared-object transition:** one subject persists while route content exits,
  camera/material moves, then new content enters.
- **Portal transition:** mask/plane opens into the next state; direct URLs render
  the destination without requiring the transition.
- **Preloader:** real progress from fonts/models/textures, useful content/fallback
  immediately available, one choreographed handoff.
- **Mobile translation:** shorter chapters, no long pins, lower scene complexity,
  poster/static spatial composition where necessary.
- **Fallback:** conventional routes and content remain complete when the stage is
  absent, reduced, or lost.
