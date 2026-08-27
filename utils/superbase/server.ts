
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Creates a server-side Supabase client instance bound to Next.js cookie stores.
 * Used in React Server Components (RSC) and Server Actions / API Route handlers.
 *
 * @param cookieStore - The Next.js cookies() read-only/writable cookie interface.
 */
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(async ({ name, value, options }) => (await cookieStore).set(name, value, options))
          } catch {
            // The `setAll` method was called from a Server Component.
            // Safe to ignore if middleware is updating user sessions.
          }
        },
      },
    },
  );
};

