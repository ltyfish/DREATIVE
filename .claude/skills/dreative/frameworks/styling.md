# Styling-system adapter

- Keep the repository's existing styling system unless migration was explicitly
  approved.
- For Tailwind, reuse theme tokens and component recipes; avoid unreadable piles
  of one-off arbitrary values.
- For CSS Modules, colocate component styles and keep global tokens/utilities in
  the established global layer.
- For CSS-in-JS, preserve SSR extraction and theme providers; avoid per-render
  style object creation in animated paths.
- For design systems, compose existing primitives before creating replacements.
- Put durable color, type, spacing, radius, shadow, and motion decisions in tokens.
- Verify focus-visible, forced colors where relevant, reduced motion, responsive
  overflow, and browser support for advanced CSS.
