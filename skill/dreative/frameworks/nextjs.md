# Next.js adapter

- Preserve App Router/Pages Router conventions already used by the repository.
- Prefer Server Components; add `"use client"` only at the smallest interactive
  boundary.
- Keep metadata, loading, error, not-found, route groups, and parallel routes
  intact during redesigns.
- Use `next/image` with dimensions/sizes and `next/font` when compatible with the
  existing stack.
- Dynamically import browser-only animation/WebGL with SSR disabled and a real
  poster/skeleton fallback.
- Do not move data fetching client-side merely to simplify visual implementation.
- Verify navigation, hydration, production build, and both server/client states.
