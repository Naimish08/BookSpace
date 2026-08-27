# AGENTS.md - BookSpace Context & Developer Guide for AI Agents

Welcome to **BookSpace**, a web application and community platform for book lovers, reading clubs, book exchanges, reading streak tracking, community blogs, real-time chat, events, and literary impact tracking.

This file serves as the definitive reference manual and context repository for AI agents (and human developers) working on the BookSpace codebase.

---

## 1. Executive Summary & Tech Stack

| Category | Technology / Library | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15.3.5 (App Router) | Server-side rendering, React Server Components (RSC), API routes |
| **Language** | TypeScript 5 | Strict typing across components, models, and utility functions |
| **UI Library** | React 19.2.7 | UI rendering, client-side state management |
| **Styling** | Tailwind CSS 3.4.17 | Utility-first CSS styling with CSS variables |
| **Component Primitives**| Radix UI & Shadcn | Modular, accessible UI primitives (`components/ui/*`) |
| **Animations** | Framer Motion & CSS Animations | Fluid UI transitions, book flipping, letter opening |
| **Database & ORM** | PostgreSQL & Prisma 6.19.3 | Schema management, migrations, custom output to `@/lib/generated/prisma` |
| **Auth & Backend** | Supabase (`@supabase/ssr`) | User authentication, session cookies, database connection pooling |
| **State & Forms** | React Hook Form & Zod | Form state validation and type-safe payloads |
| **Package Manager** | `pnpm` (also supports `npm`) | Dependency management |

---

## 2. Codebase Architecture & Directory Structure

```text
BookSpace/
├── app/                        # Next.js 15 App Router pages & API endpoints
│   ├── about-us/               # About page component & content
│   ├── api/                    # Server-side REST API handlers
│   │   ├── badges/             # User badge award & fetch endpoints
│   │   ├── blogs/              # Community blog post CRUD
│   │   ├── books/              # Book search, metadata, and listing
│   │   ├── chat/               # Community chat message endpoints
│   │   ├── events/             # Event listing & registration API
│   │   ├── onboarding/         # New user onboarding payload handler
│   │   ├── quotes/             # Reading quotes API
│   │   ├── search/             # Global search handler
│   │   ├── streak/             # Reading streak calendar & views API
│   │   ├── users/              # User profile CRUD
│   │   └── wishlist/           # User wishlist management API
│   ├── auth/                   # Supabase authentication callback handlers
│   ├── blogs/                  # Blog listing & post view pages
│   ├── chat/                   # Real-time community chat interface
│   ├── club/                   # Book club hub & community features
│   ├── contact/                # Contact & idea suggestion forms
│   ├── events/                 # Event showcase & registration pages
│   ├── join-us/                # Onboarding workflow page
│   ├── login-signup/           # Auth login/signup modal pages
│   ├── profile/                # User profile, streaks, badges & wishlists
│   ├── writers/                # Writer spotlight & submissions
│   ├── globals.css             # Global styles, Tailwind directives, theme variables
│   ├── layout.tsx              # Root HTML wrapper with fonts & ThemeProvider
│   └── page.tsx                # Homepage hero, features, impact, carousels
├── components/                 # React UI components
│   ├── ui/                     # Radix UI / Shadcn primitives (50+ components)
│   ├── AboutUs.tsx             # About section view component
│   ├── book-carousel.tsx       # Featured books carousel (Embla Carousel)
│   ├── book-flip-animation.tsx # Animated book cover flip viewer
│   ├── event-carousel.tsx      # Upcoming events carousel
│   ├── Footer.tsx              # Application global footer
│   ├── Header.tsx              # Application global header / banner
│   ├── LetterOpeningAnimation.tsx # Welcome / onboarding animation
│   ├── Navbar.tsx              # Main navigation menu
│   ├── onboarding-modal.tsx    # User onboarding modal wizard
│   ├── scroll-message.tsx      # Dynamic marquee / scrolling notification
│   └── theme-provider.tsx      # Dark / Light theme provider (next-themes)
├── hooks/                      # Custom React hooks (e.g. use-toast.ts)
├── lib/                        # Helper utilities & singleton clients
│   ├── generated/prisma/       # Auto-generated Prisma Client (DO NOT MANUALLY EDIT)
│   ├── prisma.ts               # Global Prisma client singleton instance
│   └── utils.ts                # Tailwind class merge utility (cn)
├── utils/                      # External service configurations
│   └── superbase/              # Supabase SSR client factories
│       ├── client.ts           # Browser client factory (createBrowserClient)
│       ├── middleware.ts       # Middleware session updater
│       └── server.ts           # Server client factory (createServerClient)
├── prisma/                     # Database schemas & migrations
│   ├── schema.prisma           # Complete database schema definition
│   └── migrations/             # Migration SQL files
├── public/                     # Static assets (images, icons, SVG files)
├── .env                        # Local environment variables (DB URLs, Supabase keys)
├── next.config.mjs             # Next.js configuration settings
├── package.json                # Project dependencies and script declarations
├── tailwind.config.ts          # Tailwind theme colors, keyframes, and plugins
└── tsconfig.json               # TypeScript compiler config & path aliases (@/*)
```

---

## 3. Database Schema & Prisma Data Models

The database schema is managed via Prisma (`prisma/schema.prisma`) targeting PostgreSQL (Supabase DB).

> **IMPORTANT**: The Prisma client output location is configured to `../lib/generated/prisma`. Always import `prisma` from `@/lib/prisma` and types from `@/lib/generated/prisma`.

### Key Data Models

1. **User**
   - Core account record linked with Supabase Auth (UUID primary key).
   - Fields: `id`, `username`, `name`, `email`, `age`, `occupation`, `address`, `bio`, `genres` (string array), `created_at`.
   - Relations: `badges`, `bookDiaries`, `bookExchanges`, `bookspaceProfile`, `wishlists`, `eventParticipations`, `blogPosts`, `chatMessages`.

2. **BookspaceProfile**
   - Extended user profile statistics and reading activity.
   - Fields: `user_id` (PK), `bio`, `current_read` (FK to Book), `views`, `reads`, `connection` (UUID array), `streak_calendar` (JSON).

3. **Book**
   - Catalogue of books available for reading, exchange, or recommendation.
   - Fields: `id`, `name`, `author`, `genre`, `image`, `created_at`.
   - Relations: `bookDiaries`, `bookExchanges`, `bookRecommends`, `BookspaceProfile`, `monthlyReads`, `wishlists`.

4. **BookDiary**
   - Tracks a user's reading history, entries, or reading progress.
   - Fields: `id`, `user_id`, `book_id`, `type` (e.g. reading, finished, wish), `start_date`, `end_date`, `description`.

5. **BookExchange**
   - Handles book swapping requests between community members.
   - Fields: `id`, `user_id`, `book_id`, `feedback`, `status` (default: "pending").

6. **Wishlist**
   - Saved books saved by users.
   - Fields: `id`, `user_id`, `book_id`, `added_at`. Unique on `[user_id, book_id]`.

7. **Event & EventParticipation**
   - Book club events and registration tracking.
   - Fields: `event_name`, `description`, `venue`, `time`, `image`, `blog_link`.

8. **BlogPost**
   - Internal community blog articles written by members.
   - Fields: `id`, `author_id`, `title`, `content`, `excerpt`, `cover_image`, `published`, `created_at`, `updated_at`.

9. **ChatMessage**
   - Real-time or community chat messages.
   - Fields: `id`, `user_id`, `username`, `message`, `created_at`.

10. **Other Models**: `Badge`, `MonthlyRead`, `BookRecommend`, `Suggestion`, `Impact`, `TeamMember`, `Blog`.

---

## 4. Authentication & Supabase Integration

Supabase SSR (`@supabase/ssr`) handles auth cookies and session persistence.

- **Client Components**:
  ```typescript
  import { createClient } from "@/utils/superbase/client";
  const supabase = createClient();
  ```
- **Server Components / API Routes**:
  ```typescript
  import { createClient } from "@/utils/superbase/server";
  const supabase = await createClient();
  ```
- **Middleware Session Token Sync**: `utils/superbase/middleware.ts` handles token refreshes during route navigation.

---

## 5. Development Workflows & Terminal Commands

### Environment Setup
Create a `.env` file at root with the following keys:
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR_SUPABASE_PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="[YOUR_SUPABASE_PUBLISHABLE_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SUPABASE_SERVICE_ROLE_KEY]"
```

### Essential Commands

| Command | Action |
| :--- | :--- |
| `pnpm install` | Install all workspace node modules |
| `npx prisma generate` | Regenerate Prisma client in `@/lib/generated/prisma` |
| `pnpm dev` | Start local Next.js development server at `http://localhost:3000` |
| `pnpm build` | Generate Prisma client and run `next build` production build |
| `pnpm lint` | Execute ESLint code checks |
| `npx prisma db push` | Push schema changes directly to the database without migration files |
| `npx prisma migrate dev` | Create and apply database migrations in development |

---

## 6. AI Agent Guidelines & Coding Standards

When making modifications or adding features to BookSpace, AI agents MUST follow these instructions:

### 1. Database Operations
- Always import the Prisma client instance from `@/lib/prisma`:
  ```typescript
  import { prisma } from '@/lib/prisma';
  ```
- Import database types from `@/lib/generated/prisma`:
  ```typescript
  import { User, Book, BookDiary } from '@/lib/generated/prisma';
  ```
- **Schema Modifications**: If `prisma/schema.prisma` is updated, always run `npx prisma generate` immediately to re-sync TypeScript client definitions.

### 2. Next.js App Router Rules
- Mark client-interactive components (using React hooks, event handlers, or browser APIs) with `'use client';` at the top of the file.
- Use Next.js dynamic routing convention for parameter routes (e.g. `app/blogs/[id]/page.tsx`).
- Handle loading and error states using Next.js `loading.tsx` and `error.tsx` conventions where applicable.

### 3. Component & Styling Conventions
- Use Tailwind CSS classes for layout and styling.
- Import standard UI components from `@/components/ui/[component-name]` (e.g. `@/components/ui/button`).
- Merge conditional Tailwind classes using the `cn()` helper from `@/lib/utils`:
  ```typescript
  import { cn } from '@/lib/utils';
  ```
- Ensure dark/light mode compatibility by utilizing CSS variables defined in `globals.css` (e.g. `bg-background text-foreground`).

### 4. Code Quality & Imports
- Use path aliases `@/*` for imports from project root (e.g. `@/components/...`, `@/lib/...`).
- Keep code clean, type-safe, and handle optional/nullable fields gracefully (especially for Prisma model fields like `username`, `bio`, `genres`).
- Validate request bodies in API routes using `zod` schemas or explicit type guards.

---

## 7. Quick Reference: Path Aliases & Imports

```typescript
// Prisma Client Singleton
import { prisma } from "@/lib/prisma";

// Generated Prisma Types
import type { User, Book, Wishlist } from "@/lib/generated/prisma";

// Supabase Clients
import { createClient as createBrowserClient } from "@/utils/superbase/client";
import { createClient as createServerClient } from "@/utils/superbase/server";

// Utility Functions
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
```
