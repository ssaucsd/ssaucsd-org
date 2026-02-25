// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import posthog from "posthog-js";

const isProduction = process.env.NODE_ENV === "production";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "/dih",
  ui_host: "https://us.posthog.com",
  // Include the defaults option as required by PostHog
  defaults: "2025-05-24",
  // Sentry handles exception capture — avoid duplicate tracking overhead
  capture_exceptions: false,
  // Disable surveys in production to lower client overhead.
  disable_surveys: isProduction,
  // Defer loading session recording to reduce initial bundle size
  disable_session_recording: isProduction,
  // Skip feature flags request on first load for faster init
  advanced_disable_feature_flags_on_first_load: true,
  // Turn on debug in development mode.
  debug: !isProduction,
});

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: isProduction ? 0.2 : 1,
  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: isProduction ? 0.02 : 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: isProduction ? 0.5 : 1.0,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

// Lazy-load the Replay integration to avoid adding ~50KB to the initial bundle.
// The integration will be loaded asynchronously and added once available.
import("@sentry/nextjs").then((lazyLoadedSentry) => {
  Sentry.addIntegration(lazyLoadedSentry.replayIntegration());
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
