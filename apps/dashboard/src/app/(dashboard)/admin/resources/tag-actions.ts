"use server";

import { revalidatePath } from "next/cache";
import { getIsAdmin } from "@/lib/queries";
import { convexMutation } from "@/lib/convex/server";

export type TagActionResult = {
  success: boolean;
  error?: string;
};

export async function createTag(formData: FormData): Promise<TagActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  if (!name?.trim()) {
    return { success: false, error: "Tag name is required" };
  }

  try {
    await convexMutation("resources:createTagByAdmin", {
      name: name.trim(),
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create tag",
    };
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}

export async function updateTag(
  id: string,
  formData: FormData,
): Promise<TagActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  if (!name?.trim()) {
    return { success: false, error: "Tag name is required" };
  }

  try {
    await convexMutation("resources:updateTagByAdmin", {
      id,
      name: name.trim(),
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update tag",
    };
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}

export async function deleteTag(id: string): Promise<TagActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await convexMutation("resources:deleteTagByAdmin", { id });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete tag",
    };
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}
