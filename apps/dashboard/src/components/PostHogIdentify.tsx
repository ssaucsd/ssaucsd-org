"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { createClient } from "@/lib/supabase/client";

/**
 * Client-side component that identifies the user with PostHog
 * when they have an existing session. This should be rendered
 * in the root layout to ensure user identification happens
 * on initial page load.
 */
export function PostHogIdentify() {
    useEffect(() => {
        const identifyUser = async () => {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // Only identify if not already identified with this user ID
                const currentDistinctId = posthog.get_distinct_id?.();
                if (currentDistinctId !== user.id) {
                    posthog.identify(user.id, {
                        email: user.email,
                        provider: user.app_metadata?.provider,
                    });
                }
            }
        };

        identifyUser();

        // Also listen for auth state changes (e.g., login/logout while on site)
        const supabase = createClient();
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                posthog.identify(session.user.id, {
                    email: session.user.email,
                    provider: session.user.app_metadata?.provider,
                });
            } else if (event === "SIGNED_OUT") {
                posthog.reset();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return null;
}
