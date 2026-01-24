"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getPostHogClient } from "@/lib/posthog-server";

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
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const { error } = await supabase
    .from("profiles")
    .update({
      preferred_name: validatedFields.data.preferred_name,
      instrument: validatedFields.data.instrument,
      major: validatedFields.data.major,
      graduation_year: validatedFields.data.graduation_year,
      is_onboarded: true,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Failed to update profile: " + error.message };
  }

  // Track onboarding completed event
  const posthog = getPostHogClient();

  // Update user identity with profile information
  posthog.identify({
    distinctId: user.id,
    properties: {
      email: user.email,
      preferred_name: validatedFields.data.preferred_name,
      instrument: validatedFields.data.instrument,
      major: validatedFields.data.major,
      graduation_year: validatedFields.data.graduation_year,
    },
  });

  posthog.capture({
    distinctId: user.id,
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
