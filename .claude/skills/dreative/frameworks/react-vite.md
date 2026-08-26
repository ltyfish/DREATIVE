# React and Vite adapter

- Follow the repository's component boundaries and state-management conventions.
- Keep page structure semantic; use components for repeated behavior, not every
  visual wrapper.
- Lazy-load heavy routes and 3D/media systems with `React.lazy` and `Suspense`.
- Put browser-only effects in guarded effects and clean up listeners, observers,
  timelines, media, and WebGL resources on unmount.
- Preserve existing providers, route composition, handlers, and test selectors.
- Use Vite asset imports or `public/` consistently with the host project.
- Run the repository's typecheck/build and verify the production bundle, not only
  the development server.
