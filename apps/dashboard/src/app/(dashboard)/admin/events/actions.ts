"use server";

import { revalidatePath } from "next/cache";
import { getIsAdmin, getEventRsvps, type EventRsvp } from "@/lib/queries";
import { convexMutation } from "@/lib/convex/server";

export type ActionResult = {
  success: boolean;
  error?: string;
};

export async function createEvent(formData: FormData): Promise<ActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const location = formData.get("location") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;
  const imageUrl = formData.get("image_url") as string;
  const isAllDay = formData.get("is_all_day") === "on";

  if (!title || !location || !startTime || !endTime) {
    return {
      success: false,
      error: "Title, location, start time, and end time are required",
    };
  }

  await convexMutation("events:createByAdmin", {
    title,
    description: description || null,
    location,
    start_time: startTime,
    end_time: endTime,
    image_url: imageUrl || "",
    is_all_day: isAllDay,
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function updateEvent(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const location = formData.get("location") as string;
  const startTime = formData.get("start_time") as string;
  const endTime = formData.get("end_time") as string;
  const imageUrl = formData.get("image_url") as string;
  const isAllDay = formData.get("is_all_day") === "on";

  if (!title || !location || !startTime || !endTime) {
    return {
      success: false,
      error: "Title, location, start time, and end time are required",
    };
  }

  await convexMutation("events:updateByAdmin", {
    id,
    title,
    description: description || null,
    location,
    start_time: startTime,
    end_time: endTime,
    image_url: imageUrl || "",
    is_all_day: isAllDay,
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  await convexMutation("events:deleteByAdmin", { id });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/");
  return { success: true };
}

export type RsvpResult = {
  success: boolean;
  data?: EventRsvp[];
  error?: string;
};

export async function getEventRsvpsAction(
  eventId: string,
): Promise<RsvpResult> {
  const isAdmin = await getIsAdmin();
  if (!isAdmin) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const rsvps = await getEventRsvps(eventId);
    return { success: true, data: rsvps };
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return { success: false, error: "Failed to fetch RSVPs" };
  }
}
