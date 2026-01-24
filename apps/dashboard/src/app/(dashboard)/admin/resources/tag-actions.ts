"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getIsAdmin } from "@/lib/queries";

export type TagActionResult = {
  success: boolean;
  error?: string;
};

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createTag(formData: FormData): Promise<TagActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  if (!name?.trim()) {
    return { success: false, error: "Tag name is required" };
  }

  const slug = generateSlug(name);
  const supabase = await createClient();

  // Get the next display order
  const { data: maxOrder } = await supabase
    .from("tags")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const displayOrder = (maxOrder?.display_order || 0) + 1;

  const { error } = await supabase.from("tags").insert({
    name: name.trim(),
    slug,
    display_order: displayOrder,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A tag with this name already exists" };
    }
    return { success: false, error: error.message };
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

  const slug = generateSlug(name);
  const supabase = await createClient();

  const { error } = await supabase
    .from("tags")
    .update({ name: name.trim(), slug })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "A tag with this name already exists" };
    }
    return { success: false, error: error.message };
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

  const supabase = await createClient();
  const { error } = await supabase.from("tags").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/resources");
  revalidatePath("/resources");
  return { success: true };
}
