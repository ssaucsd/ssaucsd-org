"use server";

import { revalidatePath } from "next/cache";
import { getIsAdmin } from "@/lib/queries";
import { convexMutation } from "@/lib/convex/server";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function updateUserProfile(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const firstName = formData.get("first_name") as string;
  const lastName = formData.get("last_name") as string;
  const preferredName = formData.get("preferred_name") as string | null;
  const instrument = formData.get("instrument") as string | null;
  const role = formData.get("role") as "admin" | "user";
  const major = formData.get("major") as string | null;
  const graduationYear = formData.get("graduation_year") as string | null;

  if (!firstName || !lastName) {
    return { success: false, error: "First name and last name are required" };
  }

  if (!role || (role !== "admin" && role !== "user")) {
    return { success: false, error: "Valid role is required" };
  }

  await convexMutation("users:updateProfileByAdmin", {
    id,
    first_name: firstName,
    last_name: lastName,
    preferred_name: preferredName || null,
    instrument: instrument || null,
    role,
    major: major || null,
    graduation_year: graduationYear
      ? Number.parseInt(graduationYear, 10)
      : null,
  });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUserProfile(id: string): Promise<ActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  await convexMutation("users:deleteProfileByAdmin", { id });

  revalidatePath("/admin/users");
  return { success: true };
}
