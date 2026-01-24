import "server-only";

import { createClient } from "./supabase/server";
import { Tables } from "@ssaucsd/database";

export type Event = Tables<"events">;

export const getFirstName = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

  return profile?.first_name;
};

export const getUserProfile = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile;
};

export const getIsAdmin = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
};

export const getEvents = async (): Promise<Event[] | null> => {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("start_time", { ascending: true });
  return events;
};

export const getUpcomingEvents = async (): Promise<Event[] | null> => {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("start_time", now)
    .order("start_time", { ascending: true });
  return events;
};

export type EventWithRsvp = Event & {
  rsvp_status: "going" | "maybe" | "not_going" | null;
  rsvp_count: number;
};

export const getUpcomingEventsWithRsvp = async (): Promise<
  EventWithRsvp[] | null
> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const now = new Date().toISOString();

  const { data: events } = await supabase
    .from("events")
    .select(
      `
            *,
            rsvps (
                user_id,
                status
            )
        `,
    )
    .gte("start_time", now)
    .order("start_time", { ascending: true });

  if (!events) return null;

  // Type casting here because Supabase complex join types can be tricky to infer automatically
  const typedEvents = events as unknown as (Event & {
    rsvps: { user_id: string; status: "going" | "maybe" | "not_going" }[];
  })[];

  return typedEvents.map((event) => ({
    ...event,
    rsvp_status: user
      ? event.rsvps.find((r) => r.user_id === user.id)?.status || null
      : null,
    rsvp_count: event.rsvps.filter((r) => r.status === "going").length,
  }));
};

export type Resource = Tables<"resources">;
export type Tag = Tables<"tags">;
export type ResourceWithTags = Resource & {
  tags: Tag[];
};

export const getResources = async (): Promise<Resource[] | null> => {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("name", { ascending: true });
  return resources;
};

export const getPinnedResources = async (): Promise<Resource[] | null> => {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("is_pinned", true)
    .order("name", { ascending: true });
  return resources;
};

/**
 * Get pinned resources with their tags
 */
export const getPinnedResourcesWithTags = async (): Promise<
  ResourceWithTags[] | null
> => {
  const supabase = await createClient();

  const { data: resources } = await supabase
    .from("resources")
    .select(
      `
            *,
            resource_tags(
                tags(*)
            )
        `,
    )
    .eq("is_pinned", true)
    .order("name", { ascending: true });

  // Transform nested structure to flat array of tags
  return (
    resources?.map((resource) => ({
      ...resource,
      tags:
        (resource.resource_tags
          ?.map((rt: { tags: Tag | null }) => rt.tags)
          .filter(Boolean) as Tag[]) || [],
    })) || null
  );
};

/**
 * Get all tags ordered by display_order
 */
export const getTags = async (): Promise<Tag[] | null> => {
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("tags")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });
  return tags;
};

/**
 * Get all resources with their tags
 */
export const getResourcesWithTags = async (): Promise<
  ResourceWithTags[] | null
> => {
  const supabase = await createClient();

  const { data: resources } = await supabase
    .from("resources")
    .select(
      `
            *,
            resource_tags(
                tags(*)
            )
        `,
    )
    .order("is_pinned", { ascending: false })
    .order("name", { ascending: true });

  // Transform nested structure to flat array of tags
  return (
    resources?.map((resource) => ({
      ...resource,
      tags:
        (resource.resource_tags
          ?.map((rt: { tags: Tag | null }) => rt.tags)
          .filter(Boolean) as Tag[]) || [],
    })) || null
  );
};

export type Profile = Tables<"profiles">;

export type EventRsvp = {
  user_id: string;
  status: "going" | "maybe" | "not_going";
  created_at: string;
  profile: Profile | null;
};

export const getEventRsvps = async (
  eventId: string,
): Promise<EventRsvp[] | null> => {
  const supabase = await createClient();

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select(
      `
            user_id,
            status,
            created_at,
            profile:profiles(*)
        `,
    )
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  if (!rsvps) return null;

  // Type casting to handle the joined profile data correctly
  return rsvps as unknown as EventRsvp[];
};

/**
 * Get all profiles for admin management
 */
export const getAllProfiles = async (): Promise<Profile[] | null> => {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("first_name", { ascending: true })
    .order("last_name", { ascending: true });
  return profiles;
};

/**
 * Get events the current user has RSVP'd to (going or maybe)
 */
export const getUserRsvpEvents = async (): Promise<EventWithRsvp[] | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select(
      `
      status,
      event:events(*)
    `,
    )
    .eq("user_id", user.id)
    .in("status", ["going", "maybe"]);

  if (!rsvps) return null;

  // Type casting for the joined event data
  const typedRsvps = rsvps as unknown as {
    status: "going" | "maybe" | "not_going";
    event: Event;
  }[];

  const now = new Date();

  return typedRsvps
    .filter((rsvp) => rsvp.event !== null)
    .filter((rsvp) => new Date(rsvp.event.end_time) >= now)
    .map((rsvp) => ({
      ...rsvp.event,
      rsvp_status: rsvp.status,
      rsvp_count: 0, // We don't need the count for this view
    }))
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );
};
