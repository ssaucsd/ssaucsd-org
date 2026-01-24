"use client";

import { GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import posthog from "posthog-js";

async function handleLogin() {
  // Track login started event
  posthog.capture("login_started", {
    provider: "google",
  });

  const supabase = createClient();
  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export default function Auth() {
  return (
    <div className="flex flex-col min-h-screen w-full p-4 gap-4 justify-center items-center">
      <h1 className="text-4xl font-serif">Welcome to SSA!</h1>
      <p className="text-lg text-muted-foreground">
        Please log in with your UCSD email to continue.
      </p>

      <Button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full cursor-pointer"
        onClick={handleLogin}
      >
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={GoogleIcon} />
          Log in with Google
        </div>
      </Button>
    </div>
  );
}
