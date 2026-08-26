# Vue and Nuxt adapter

- Preserve the repository's Composition/Options API convention and component
  contracts.
- Keep Nuxt layouts, middleware, route metadata, async data, error, and loading
  behavior intact.
- Put browser-only effects behind `onMounted`/`ClientOnly`; dispose them in
  `onBeforeUnmount`.
- Prefer scoped components/composables for behavior and semantic templates for
  structure.
- Preserve emitted events, model bindings, slots, and test selectors.
- Verify SSR/hydration, production build, navigation, and state transitions.
