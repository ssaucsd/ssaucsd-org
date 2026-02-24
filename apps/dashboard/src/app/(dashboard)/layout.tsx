import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session.userId) {
    redirect("/auth");
  }

  const user = await currentUser();
  const primaryEmail =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress;

  if (!primaryEmail) {
    redirect("/auth?error=missing_email");
  }

  try {
    await convexMutation("users:syncCurrentUser");
  } catch (error) {
    console.error("Failed to sync current user in dashboard layout", error);
    redirect(`/auth?error=${getAuthErrorCode(error)}`);
  }

  const state = await convexQuery<{
    authenticated: boolean;
    profile_exists: boolean;
    is_onboarded: boolean;
  }>("users:getOnboardingState");

  if (!state.is_onboarded) {
    redirect("/onboarding");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full">
        <header className="fixed top-0 z-10 flex w-full h-14 shrink-0 items-center gap-2 px-4 border-b bg-background">
          <SidebarTrigger className="-ml-1" />
          <DynamicBreadcrumb />
        </header>
        <div className="p-4 pt-16">{children}</div>
      </main>
    </SidebarProvider>
  );
}
