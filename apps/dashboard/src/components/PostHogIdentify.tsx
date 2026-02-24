"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { useAuth, useUser } from "@clerk/nextjs";

export function PostHogIdentify() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isSignedIn || !user) {
      posthog.reset();
      return;
    }

    const currentDistinctId = posthog.get_distinct_id?.();
    if (currentDistinctId !== user.id) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
      });
    }
  }, [isSignedIn, user]);

  return null;
}
