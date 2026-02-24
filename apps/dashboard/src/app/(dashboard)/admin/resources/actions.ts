"use server";

import { revalidatePath } from "next/cache";
import { getIsAdmin } from "@/lib/queries";
import { convexMutation } from "@/lib/convex/server";

export type ActionResult = {
  success: boolean;
  error?: string;
};

const toTagIds = (value: FormDataEntryValue | null) =>
  typeof value === "string"
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

export async function createResource(
  formData: FormData,
): Promise<ActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const link = formData.get("link") as string;
  const description = formData.get("description") as string | null;
  const isPinned = formData.get("is_pinned") === "on";
  const tagIds = toTagIds(formData.get("tagIds"));

  if (!name || !link) {
    return { success: false, error: "Name and link are required" };
  }

  await convexMutation("resources:createResourceByAdmin", {
    name,
    link,
    description: description || null,
    is_pinned: isPinned,
    tag_ids: tagIds,
  });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath("/");
  return { success: true };
}

export async function updateResource(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const link = formData.get("link") as string;
  const description = formData.get("description") as string | null;
  const isPinned = formData.get("is_pinned") === "on";
  const tagIds = toTagIds(formData.get("tagIds"));

  if (!name || !link) {
    return { success: false, error: "Name and link are required" };
  }

  await convexMutation("resources:updateResourceByAdmin", {
    id,
    name,
    link,
    description: description || null,
    is_pinned: isPinned,
    tag_ids: tagIds,
  });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath("/");
  return { success: true };
}

export async function deleteResource(id: string): Promise<ActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  await convexMutation("resources:deleteResourceByAdmin", { id });

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath("/");
  return { success: true };
}
