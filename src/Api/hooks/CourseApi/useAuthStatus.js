"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "@/lib/apiBase";

// Login state for gating actions (e.g. Download Curriculum) that must tell
// "not logged in" apart from "not known yet". Returns
//   { status: "loading" | "authenticated" | "unauthenticated", user }
//
// Same source of truth as the rest of the app (NavbarTop, Login.jsx):
// localStorage.loginuserData, falling back to the backend session via
// /api/me when it's absent (Google OAuth return lands with a session cookie
// but nothing in localStorage yet).
//
// Why not useUserProfile().data?.email, which the course page used before:
// that's the result of a /myprofile network call, so a logged-in user read
// as logged out until it resolved (or forever if it failed), and because it
// reads localStorage during render without subscribing, a login written
// after mount (NavbarTop's /api/me bootstrap) was only noticed on the next
// unrelated re-render - hence "first click says login, refresh works".
//
// "loading" on the server and the first client render keeps hydration
// consistent (the server can't see localStorage).
const STORAGE_KEY = "loginuserData";
const ME_TIMEOUT_MS = 8000;

function subscribe(onChange) {
  // Login.jsx / NavbarTop / Register dispatch a synthetic "storage" event
  // after writing loginuserData in the same tab; real ones cover other tabs.
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parseStored(raw) {
  try {
    const u = raw ? JSON.parse(raw) : null;
    return u?.email ? u : null;
  } catch {
    return null;
  }
}

export function useAuthStatus() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const stored = parseStored(useSyncExternalStore(subscribe, readStored, () => null));

  const me = useQuery({
    queryKey: ["auth-status-me"],
    enabled: mounted && !stored,
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/me`, {
        credentials: "include",
        signal: AbortSignal.timeout(ME_TIMEOUT_MS),
      });
      if (!res.ok) return null;
      const u = await res.json();
      return u?.email ? u : null;
    },
    retry: false,
    refetchOnWindowFocus: false,
    // Not cached across mounts: logout clears localStorage and navigates
    // away without an event, and a cached session answer must not log the
    // user back in on the next course page.
    gcTime: 0,
  });

  // A given /api/me answer is persisted once. If loginuserData disappears
  // after that (logout does localStorage.clear() without an event, and this
  // component may re-render before navigating away), that answer is stale:
  // re-ask the backend instead of writing it back and logging the user in
  // again.
  const meUser = me.data;
  // dataUpdatedAt of the /api/me answer already reflected in localStorage -
  // either written below, or written by someone else (NavbarTop runs the same
  // bootstrap and may win the race) while this answer was in hand.
  const consumedAt = useRef(0);
  const staleAfterClear = !stored && !!meUser && me.dataUpdatedAt === consumedAt.current;
  const { refetch } = me;
  useEffect(() => {
    if (stored && meUser) consumedAt.current = me.dataUpdatedAt;
  }, [stored, meUser, me.dataUpdatedAt]);
  useEffect(() => {
    if (staleAfterClear) refetch();
  }, [staleAfterClear, refetch]);

  // Persist an OAuth-restored session the same way NavbarTop does, so every
  // other localStorage-based check in the app agrees.
  useEffect(() => {
    if (!meUser || stored || staleAfterClear) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ name: meUser.name || "", email: meUser.email, picture: meUser.picture || "" })
      );
      consumedAt.current = me.dataUpdatedAt;
      window.dispatchEvent(new Event("storage"));
    } catch {
      // storage unavailable - the in-memory answer below still applies
    }
  }, [meUser, stored, staleAfterClear, me.dataUpdatedAt]);

  if (!mounted) return { status: "loading", user: null };
  if (stored) return { status: "authenticated", user: stored };
  // Failed/timed-out check (react-query keeps the previous data on error).
  if (me.isError && !me.isFetching) return { status: "unauthenticated", user: null };
  if (me.isPending || staleAfterClear) return { status: "loading", user: null };
  if (meUser) return { status: "authenticated", user: meUser };
  return { status: "unauthenticated", user: null };
}
