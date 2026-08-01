"use client";

import { track, type AnalyticsEvents } from "@/lib/analytics/track";

export interface TrackedLinkProps<E extends keyof AnalyticsEvents>
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: E;
  eventProps?: AnalyticsEvents[E];
}

/**
 * A plain <a> that fires an analytics event on click first. Exists so
 * Footer.tsx (rendered on every page) can stay a Server Component instead
 * of becoming a client component just for two tracked links.
 */
export function TrackedLink<E extends keyof AnalyticsEvents>({
  event,
  eventProps,
  onClick,
  ...props
}: TrackedLinkProps<E>) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...props}
      onClick={(clickEvent) => {
        track(event, eventProps);
        onClick?.(clickEvent);
      }}
    />
  );
}
