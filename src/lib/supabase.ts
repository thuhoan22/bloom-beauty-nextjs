"use client";

import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ---------------------------------------------------------------------------
// Auth user: cached to avoid request "queueing" when many components call it.
// Supabase `auth.getUser()` hits the network; `getSession()` is usually local/fast.
// We share the in-flight Promise between callers and invalidate on auth changes.
// ---------------------------------------------------------------------------

let inFlightUserPromise: Promise<User | null> | null = null;
let inFlightStartedAt = 0;
const IN_FLIGHT_TTL_MS = 10_000;

export function invalidateAuthUserCache() {
  inFlightUserPromise = null;
  inFlightStartedAt = 0;
}

export async function getAuthUser(options?: { force?: boolean }) {
  const force = options?.force === true;

  if (!force && inFlightUserPromise) {
    // If something hung for too long, allow a fresh request.
    if (Date.now() - inFlightStartedAt < IN_FLIGHT_TTL_MS) {
      return inFlightUserPromise;
    }
    invalidateAuthUserCache();
  }

  inFlightStartedAt = Date.now();
  inFlightUserPromise = (async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    const sessionUser = sessionData.session?.user ?? null;
    if (sessionUser) return sessionUser;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    return userData.user ?? null;
  })().catch((err) => {
    // Don't keep a rejected promise cached.
    invalidateAuthUserCache();
    throw err;
  });

  return inFlightUserPromise;
}

// Auto-invalidate cache on auth changes (login/logout/refresh).
// Safe in client-only module.
supabase.auth.onAuthStateChange(() => {
  invalidateAuthUserCache();
});