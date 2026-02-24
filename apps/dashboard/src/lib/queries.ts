import "server-only";

import { convexPublicQuery, convexQuery } from "./convex/server";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  start_time: string;
  end_time: string;
  image_url: string;
  is_all_day: boolean;
  created_at: string;
  updated_at: string;
};

export type EventWithRsvp = Event & {
  rsvp_status: "going" | "maybe" | "not_going" | null;
  rsvp_count: number;
};

export type Resource = {
  id: string;
  name: string;
  link: string;
  description: string | null;
  is_pinned: boolean;
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
};

export type ResourceWithTags = Resource & {
  tags: Tag[];
};

export type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  instrument: string | null;
  role: "admin" | "user";
  major: string | null;
  graduation_year: number | null;
  is_onboarded: boolean;
};

export type EventRsvp = {
  user_id: string;
  status: "going" | "maybe" | "not_going";
  created_at: string;
  profile: Profile | null;
};

const withFallback = async <T>(run: () => Promise<T>, fallback: T) => {
  try {
    return await run();
  } catch {
    return fallback;
  }
};

export const getFirstName = async () => {
  return withFallback(
    () => convexQuery("users:getFirstName") as Promise<string | null>,
    null,
  );
};

export const getUserProfile = async () => {
  return withFallback(
    () => convexQuery("users:getCurrentProfile") as Promise<Profile | null>,
    null,
  );
};

export const getIsAdmin = async () => {
  return withFallback(
    () => convexQuery("users:getIsAdmin") as Promise<boolean>,
    false,
  );
};

export const getEvents = async () =>
  withFallback(
    () => convexPublicQuery("events:getAll") as Promise<Event[]>,
    [],
  );

export const getUpcomingEvents = async () =>
  withFallback(
    () => convexPublicQuery("events:getUpcoming") as Promise<Event[]>,
    [],
  );

export const getUpcomingEventsWithRsvp = async () => {
  return withFallback(
    () => convexQuery("events:getUpcomingWithRsvp") as Promise<EventWithRsvp[]>,
    [],
  );
};

export const getResources = async () =>
  withFallback(
    () => convexPublicQuery("resources:getResources") as Promise<Resource[]>,
    [],
  );

export const getPinnedResources = async () =>
  withFallback(
    () =>
      convexPublicQuery("resources:getPinnedResources") as Promise<Resource[]>,
    [],
  );

export const getPinnedResourcesWithTags = async () =>
  withFallback(
    () =>
      convexPublicQuery("resources:getPinnedResourcesWithTags") as Promise<
        ResourceWithTags[]
      >,
    [],
  );

export const getTags = async () =>
  withFallback(
    () => convexPublicQuery("resources:getTags") as Promise<Tag[]>,
    [],
  );

export const getResourcesWithTags = async () =>
  withFallback(
    () =>
      convexPublicQuery("resources:getResourcesWithTags") as Promise<
        ResourceWithTags[]
      >,
    [],
  );

export const getEventRsvps = async (eventId: string) =>
  withFallback(
    () =>
      convexQuery("events:getRsvpsByEventForAdmin", {
        event_id: eventId,
      }) as Promise<EventRsvp[]>,
    [],
  );

export const getAllProfiles = async () =>
  withFallback(
    () => convexQuery("users:listProfiles") as Promise<Profile[]>,
    [],
  );

export const getUserRsvpEvents = async () =>
  withFallback(
    () =>
      convexQuery("rsvps:getCurrentUserRsvpEvents") as Promise<EventWithRsvp[]>,
    [],
  );
