"use server";

import { convexMutation, convexQuery } from "@/lib/convex/server";
import { revalidatePath } from "next/cache";

export async function rsvpToEvent(
  eventId: string,
  status: "going" | "maybe" | "not_going" = "going",
) {
  await convexMutation("rsvps:upsertCurrentUserRsvp", {
    event_id: eventId,
    status,
  });

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function removeRsvp(eventId: string) {
  await convexMutation("rsvps:removeCurrentUserRsvp", {
    event_id: eventId,
  });

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function getUserRsvp(eventId: string) {
  try {
    return (await convexQuery("rsvps:getCurrentUserRsvp", {
      event_id: eventId,
    })) as "going" | "maybe" | "not_going" | null;
  } catch {
    return null;
  }
}
