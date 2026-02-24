import { SignIn, SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const resolveErrorMessage = (error?: string) => {
  if (error === "missing_email") {
    return "Your identity provider did not return an email address. Please sign in with an account that shares your email.";
  }

  if (error === "sync_failed") {
    return "We could not finish account setup. Verify Clerk + Convex env settings, then try again.";
  }

  if (error === "missing_clerk_convex_token") {
    return "Clerk did not issue the Convex JWT token. Confirm a JWT template named 'convex' exists in Clerk.";
  }

  if (error === "convex_auth_failed") {
    return "Convex rejected the auth token. Verify CLERK_JWT_ISSUER_DOMAIN and JWT template audience ('convex').";
  }

  if (error === "invalid_clerk_convex_template") {
    return "Clerk JWT template 'convex' is missing aud='convex'. Add it in Clerk JWT templates.";
  }

  if (error === "convex_issuer_mismatch") {
    return "Clerk token issuer does not match CLERK_JWT_ISSUER_DOMAIN in app/Convex env.";
  }

  return null;
};

export default async function Auth({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const errorMessage = resolveErrorMessage(error);

  if (session.userId && !errorMessage) {
    redirect("/");
  }

  if (session.userId && errorMessage) {
    return (
      <div className="flex flex-col min-h-screen w-full p-4 gap-4 justify-center items-center text-center">
        <h1 className="text-4xl font-serif">Account Setup Blocked</h1>
        <p className="text-lg text-muted-foreground max-w-xl">{errorMessage}</p>
        <SignOutButton redirectUrl="/auth">
          <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
            Sign out and try another account
          </button>
        </SignOutButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-4 gap-4 justify-center items-center">
      <h1 className="text-4xl font-serif">Welcome to SSA!</h1>
      <p className="text-lg text-muted-foreground">
        Please log in with your email to continue.
      </p>
      {errorMessage ? (
        <p className="text-sm text-center text-destructive max-w-xl">
          {errorMessage}
        </p>
      ) : null}

      <SignIn
        path="/auth"
        routing="path"
        forceRedirectUrl="/"
        signUpUrl="/auth"
        appearance={{
          elements: {
            card: "shadow-none border-0 bg-transparent",
          },
        }}
      />
    </div>
  );
}
