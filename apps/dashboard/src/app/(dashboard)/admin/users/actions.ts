"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/queries";

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

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      preferred_name: preferredName || null,
      instrument: instrument || null,
      role,
      major: major || null,
      graduation_year: graduationYear ? parseInt(graduationYear, 10) : null,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function deleteUserProfile(id: string): Promise<ActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const supabase = await createClient();

  // First delete from profiles table (this will cascade due to FK constraint, but we should be explicit)
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
