"use client";

import { useCallback } from "react";

type EventName = "upgrade_page_view" | "checkout_started" | "checkout_redirected" | string;

export function useAnalytics() {
  const trackEvent = useCallback((eventName: EventName, payload?: Record<string, unknown>) => {
    // In the future, this can be swapped out with PostHog, GA4, Mixpanel, etc.
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics Event]: ${eventName}`, payload || {});
    }
  }, []);

  return { trackEvent };
}
