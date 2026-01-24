"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/queries";

export type ActionResult = {
  success: boolean;
  error?: string;
};

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
  const tagIdsString = formData.get("tagIds") as string | null;
  const tagIds = tagIdsString ? tagIdsString.split(",").filter(Boolean) : [];

  if (!name || !link) {
    return { success: false, error: "Name and link are required" };
  }

  const supabase = await createClient();
  const { data: resource, error } = await supabase
    .from("resources")
    .insert({
      name,
      link,
      description: description || null,
      is_pinned: isPinned,
    })
    .select("id")
    .single();

  if (error || !resource) {
    return {
      success: false,
      error: error?.message || "Failed to create resource",
    };
  }

  // Insert tag associations
  if (tagIds.length > 0) {
    const tagEntries = tagIds.map((tagId) => ({
      resource_id: resource.id,
      tag_id: tagId,
    }));
    const { error: tagError } = await supabase
      .from("resource_tags")
      .insert(tagEntries);
    if (tagError) {
      console.error("Failed to insert tags:", tagError);
    }
  }

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
  const tagIdsString = formData.get("tagIds") as string | null;
  const tagIds = tagIdsString ? tagIdsString.split(",").filter(Boolean) : [];

  if (!name || !link) {
    return { success: false, error: "Name and link are required" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("resources")
    .update({
      name,
      link,
      description: description || null,
      is_pinned: isPinned,
    })
    .eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  // Update tag associations: delete existing, insert new
  const { error: deleteError } = await supabase
    .from("resource_tags")
    .delete()
    .eq("resource_id", id);

  if (deleteError) {
    console.error("Failed to delete existing tags:", deleteError);
  }

  if (tagIds.length > 0) {
    const tagEntries = tagIds.map((tagId) => ({
      resource_id: id,
      tag_id: tagId,
    }));
    const { error: tagError } = await supabase
      .from("resource_tags")
      .insert(tagEntries);
    if (tagError) {
      console.error("Failed to insert tags:", tagError);
    }
  }

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

  const supabase = await createClient();
  const { error } = await supabase.from("resources").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  revalidatePath("/");
  return { success: true };
}
