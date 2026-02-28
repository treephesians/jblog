# Blog Project — Claude Guidelines

## Architecture

```
apps/blog/          Next.js 16 App Router frontend
apps/api/           FastAPI backend (PostgreSQL, JWT cookie auth)
packages/ui/        Shared shadcn/ui components (@repo/ui)
packages/content/   MDX post files
```

## Frontend Conventions (`apps/blog/`)

### File Organization
- `app/` — Pages and layouts (Server Components by default)
- `components/` — UI components. Add `"use client"` only when needed (hooks, events, browser APIs)
- `components/layout/` — Header, Footer, theme-related
- `hooks/` — React hooks (always `"use client"`)
- `lib/` — Utilities, types, server-side helpers
- `lib/types/` — Type definitions: `user.ts` (User), `api.ts` (backend response types)
- `providers/` — Context providers with `"use client"`

### State & Data Fetching
- Server Components fetch data directly (`lib/auth.ts`, `lib/content.ts`)
- Client Components use React Query hooks from `hooks/`
- **Do not duplicate query keys.** Keep them in the hook that owns the data
- React Query is provided by `QueryProvider` (wraps `<main>` only, not Header)

### Auth Pattern
- Server-side: `getCurrentUser()` from `lib/auth.ts` — reads cookie, calls FastAPI
- Client-side: `useCurrentUser()` from `hooks/use-current-user.ts`
- Login navigation: always use `useGoogleLogin()` hook (saves redirect to sessionStorage)
- Login modal: use `useLoginModal()` from `providers/login-modal-provider.tsx` — do NOT create local modal state

### Types
- All backend API response types live in `lib/types/api.ts`
- User type lives in `lib/types/user.ts`
- Component-local types stay in the component file (interfaces only used in one place)

### Component Rules
- Avoid prop drilling beyond 2 levels — use context instead
- Prefer hooks calling context (`useLoginModal()`, `useCurrentUser()`) over props for cross-cutting concerns
- Do not create a component if it's only used in one place and is small — inline it
- Delete components that are no longer imported anywhere

### Styling
- Tailwind CSS 4: use `@import "tailwindcss"` syntax (not `@tailwind` directives)
- Dark mode via `dark:` variant (next-themes with `attribute="class"`)
- UI primitives come from `@repo/ui` (shadcn/ui). Add new shadcn components to `packages/ui/src/`
- `@repo/ui` imports use relative paths internally (`./button`, `./utils`), NOT `@/` aliases

### API Calls
- Axios instance: `import api from "@/lib/api"` — always use this, never raw fetch in client components
- Base URL and credentials are preconfigured in `lib/api.ts`
- FastAPI base: `process.env.NEXT_PUBLIC_API_URL` (e.g., `http://localhost:8000`)

### Notifications / Toasts
- Use `toast` from `sonner` for user feedback
- `<Toaster>` is mounted in root layout — do not add another one

## What NOT to Do
- Do not use `navigator.share` — just clipboard copy
- Do not add `<LoginModal>` or modal state to individual components — use `useLoginModal()` context
- Do not define API response types inside hook files — put them in `lib/types/api.ts`
- Do not add `"use client"` to layout files or page files unless absolutely necessary
- Do not create barrel `index.ts` exports unless there are 5+ exports from a directory
