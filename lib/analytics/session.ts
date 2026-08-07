"use client";

const SESSION_KEY = "westora-analytics-session";

/**
 * A random client-generated id, not tied to any identity — never a
 * fingerprint, never an IP-derived value. Only ever created once a
 * visitor has explicitly allowed cookies (callers gate on that).
 */
export function getOrCreateSessionId(): { sessionId: string; isNew: boolean } {
  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return { sessionId: existing, isNew: false };

  const sessionId = crypto.randomUUID();
  window.localStorage.setItem(SESSION_KEY, sessionId);
  return { sessionId, isNew: true };
}
