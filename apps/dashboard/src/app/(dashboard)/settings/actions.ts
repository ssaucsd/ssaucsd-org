"use server";

import { convexMutation } from "@/lib/convex/server";
import { revalidatePath } from "next/cache";
import { getPostHogClient } from "@/lib/posthog-server";
import { currentUser } from "@clerk/nextjs/server";

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
) {
  const user = await currentUser();

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

  const updated = await convexMutation<{ profile: { id: string } }>(
    "users:updateCurrentProfile",
    {
      preferred_name,
      major,
      graduation_year: Number.parseInt(graduation_year, 10),
    },
  );

  const posthog = getPostHogClient();

  posthog.identify({
    distinctId: updated.profile.id,
    properties: {
      email: user.emailAddresses[0]?.emailAddress,
      preferred_name,
      major,
      graduation_year: Number.parseInt(graduation_year, 10),
    },
  });

  posthog.capture({
    distinctId: updated.profile.id,
    event: "profile_updated",
    properties: {
      major,
      graduation_year: Number.parseInt(graduation_year, 10),
    },
  });

  await posthog.shutdown();

  revalidatePath("/", "layout");
  return { success: "Profile updated successfully!" };
}
