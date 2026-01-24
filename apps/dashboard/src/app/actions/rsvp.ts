"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function rsvpToEvent(
  eventId: string,
  status: "going" | "maybe" | "not_going" = "going",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase.from("rsvps").upsert(
    {
      user_id: user.id,
      event_id: eventId,
      status,
    },
    {
      onConflict: "user_id, event_id",
    },
  );

  if (error) {
    console.error("Error RSVPing to event:", error);
    throw new Error("Failed to RSVP");
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function removeRsvp(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("rsvps")
    .delete()
    .eq("user_id", user.id)
    .eq("event_id", eventId);

  if (error) {
    console.error("Error removing RSVP:", error);
    throw new Error("Failed to remove RSVP");
  }

  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function getUserRsvp(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("rsvps")
    .select("status")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "The result contains 0 rows"
    console.error("Error fetching RSVP:", error);
    return null;
  }

  return data?.status || null;
}
