"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getPostHogClient } from "@/lib/posthog-server";

export type ActionState = {
  error?: string;
  success?: string;
  errors?: {
    preferred_name?: string[];
    major?: string[];
    graduation_year?: string[];
  };
};

export async function updateProfile(
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

  const preferred_name = formData.get("preferred_name") as string;
  const major = formData.get("major") as string;
  const graduation_year = formData.get("graduation_year") as string;

  const errors: ActionState["errors"] = {};
  if (!preferred_name) errors.preferred_name = ["Preferred name is required"];
  if (!major) errors.major = ["Major is required"];
  if (!graduation_year)
    errors.graduation_year = ["Graduation year is required"];

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      preferred_name,
      major,
      graduation_year: parseInt(graduation_year),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile. Please try again." };
  }

  // Track profile updated event
  const posthog = getPostHogClient();

  // Update user identity with new profile information
  posthog.identify({
    distinctId: user.id,
    properties: {
      email: user.email,
      preferred_name,
      major,
      graduation_year: parseInt(graduation_year),
    },
  });

  posthog.capture({
    distinctId: user.id,
    event: "profile_updated",
    properties: {
      major,
      graduation_year: parseInt(graduation_year),
    },
  });

  await posthog.shutdown();

  revalidatePath("/", "layout"); // Revalidate everything to update sidebar
  return { success: "Profile updated successfully!" };
}
