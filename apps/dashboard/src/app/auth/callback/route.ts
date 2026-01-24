import { NextResponse } from "next/server";
// The client you created from the Server-Side Auth instructions
import { createClient } from "@/lib/supabase/server";
import { getPostHogClient } from "@/lib/posthog-server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) {
    // if "next" is not a relative URL, use the default
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Get user info for tracking
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const posthog = getPostHogClient();

        // Identify user server-side with their email as distinct ID
        posthog.identify({
          distinctId: user.id,
          properties: {
            email: user.email,
            provider: user.app_metadata?.provider,
          },
        });

        // Track login completed event
        posthog.capture({
          distinctId: user.id,
          event: "login_completed",
          properties: {
            provider: user.app_metadata?.provider || "google",
            email: user.email,
          },
        });

        await posthog.shutdown();
      }

      const forwardedHost = request.headers.get("x-forwarded-host"); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === "development";
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      // Track login failed event
      const posthog = getPostHogClient();
      posthog.capture({
        distinctId: "anonymous",
        event: "login_failed",
        properties: {
          error_message: error.message,
        },
      });
      await posthog.shutdown();
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
