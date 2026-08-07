import { z } from "zod";

/**
 * Validates every payload the client-side tracker (components/analytics/
 * AnalyticsTracker.tsx) sends to app/api/analytics/route.ts. Server
 * validation is the actual gate here too (CLAUDE.md §9) — this is
 * unauthenticated, visitor-facing input.
 *
 * Array caps exist purely to stop one runaway tab from writing unbounded
 * rows, not because we expect to hit them in normal use — a single beacon
 * covers a handful of page views / section transitions / clicks at a time.
 */
export const analyticsEventSchema = z.object({
  sessionId: z.string().uuid(),
  isNewSession: z.boolean().optional(),
  entryPath: z.string().max(2048).optional(),
  referrer: z.string().max(2048).optional(),
  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  pageViews: z
    .array(z.object({ path: z.string().max(2048) }))
    .max(20)
    .optional(),
  sections: z
    .array(
      z.object({
        path: z.string().max(2048),
        sectionId: z.string().max(120),
        durationMs: z.number().int().min(0).max(30 * 60 * 1000),
      }),
    )
    .max(20)
    .optional(),
  clicks: z
    .array(
      z.object({
        path: z.string().max(2048),
        xPct: z.number().min(0).max(100),
        yPct: z.number().min(0).max(100),
      }),
    )
    .max(100)
    .optional(),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;
