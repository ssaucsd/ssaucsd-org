"use server";

import { convexMutation } from "@/lib/convex/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getPostHogClient } from "@/lib/posthog-server";
import { currentUser } from "@clerk/nextjs/server";

const onboardingSchema = z.object({
  preferred_name: z.string().min(1, "Preferred name is required"),
  instrument: z.string().min(1, "Instrument is required"),
  major: z.string().min(1, "Major is required"),
  graduation_year: z.coerce.number().min(2000).max(2100),
});

export type ActionState = {
  success?: boolean;
  error?: string;
  errors?: {
    preferred_name?: string[];
    instrument?: string[];
    major?: string[];
    graduation_year?: string[];
  };
};

export async function completeOnboarding(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await currentUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const validatedFields = onboardingSchema.safeParse({
    preferred_name: formData.get("preferred_name"),
    instrument: formData.get("instrument"),
    major: formData.get("major"),
    graduation_year: formData.get("graduation_year"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const primaryEmail =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  const profile = await convexMutation<{ profile: { id: string } }>(
    "users:completeOnboarding",
    {
      preferred_name: validatedFields.data.preferred_name,
      instrument: validatedFields.data.instrument,
      major: validatedFields.data.major,
      graduation_year: validatedFields.data.graduation_year,
      ...(primaryEmail ? { fallback_email: primaryEmail } : {}),
      ...(user.firstName ? { fallback_first_name: user.firstName } : {}),
      ...(user.lastName ? { fallback_last_name: user.lastName } : {}),
    },
  );

  const posthog = getPostHogClient();

  posthog.identify({
    distinctId: profile.profile.id,
    properties: {
      email: user.emailAddresses[0]?.emailAddress,
      preferred_name: validatedFields.data.preferred_name,
      instrument: validatedFields.data.instrument,
      major: validatedFields.data.major,
      graduation_year: validatedFields.data.graduation_year,
    },
  });

  posthog.capture({
    distinctId: profile.profile.id,
    event: "onboarding_completed",
    properties: {
      instrument: validatedFields.data.instrument,
      major: validatedFields.data.major,
      graduation_year: validatedFields.data.graduation_year,
    },
  });

  await posthog.shutdown();

  revalidatePath("/", "layout");
  redirect("/");
}
