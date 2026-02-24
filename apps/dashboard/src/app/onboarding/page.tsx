import { UserInfoForm } from "@/components/UserInfoForm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { convexMutation, convexQuery } from "@/lib/convex/server";

const getAuthErrorCode = (error: unknown) => {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error);

  if (message.includes("missing email")) {
    return "missing_email";
  }

  if (message.includes("missing clerk convex jwt token")) {
    return "missing_clerk_convex_token";
  }

  if (message.includes("missing aud='convex'")) {
    return "invalid_clerk_convex_template";
  }

  if (message.includes("jwt issuer mismatch")) {
    return "convex_issuer_mismatch";
  }

  if (
    message.includes("unauthenticated") ||
    message.includes("authentication") ||
    message.includes("could not verify")
  ) {
    return "convex_auth_failed";
  }

  return "sync_failed";
};

export default async function OnboardingPage() {
  const session = await auth();
  if (!session.userId) {
    redirect("/auth");
  }

  const user = await currentUser();
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress;
  const fallbackProfile = {
    ...(primaryEmail ? { fallback_email: primaryEmail } : {}),
    ...(user?.firstName ? { fallback_first_name: user.firstName } : {}),
    ...(user?.lastName ? { fallback_last_name: user.lastName } : {}),
  };

  try {
    await convexMutation("users:syncCurrentUser", fallbackProfile);
  } catch (error) {
    console.error("Failed to sync current user in onboarding page", error);
    redirect(`/auth?error=${getAuthErrorCode(error)}`);
  }

  const state = await convexQuery<{
    authenticated: boolean;
    profile_exists: boolean;
    is_onboarded: boolean;
  }>("users:getOnboardingState");
  if (state.is_onboarded) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <UserInfoForm />
      </div>
    </div>
  );
}
