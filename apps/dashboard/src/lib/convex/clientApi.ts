import type {
  Event,
  EventRsvp,
  EventWithRsvp,
  Profile,
  ResourceWithTags,
  Tag,
} from "@ssaucsd/database";
import { makeFunctionReference } from "convex/server";

const query = <Args extends Record<string, unknown>, ReturnValue>(
  name: string,
) => makeFunctionReference<"query", Args, ReturnValue>(name);
type NoArgs = Record<string, never>;

export const clientApi = {
  users: {
    getIsAdmin: query<NoArgs, boolean>("users:getIsAdmin"),
    getCurrentProfile: query<NoArgs, Profile | null>("users:getCurrentProfile"),
    getFirstName: query<NoArgs, string | null>("users:getFirstName"),
    listProfiles: query<NoArgs, Profile[]>("users:listProfiles"),
  },
  events: {
    getUpcomingWithRsvp: query<NoArgs, EventWithRsvp[]>(
      "events:getUpcomingWithRsvp",
    ),
    getAll: query<NoArgs, Event[]>("events:getAll"),
    getRsvpsByEventForAdmin: query<{ event_id: string }, EventRsvp[]>(
      "events:getRsvpsByEventForAdmin",
    ),
  },
  resources: {
    getPinnedResourcesWithTags: query<NoArgs, ResourceWithTags[]>(
      "resources:getPinnedResourcesWithTags",
    ),
    getResourcesWithTags: query<NoArgs, ResourceWithTags[]>(
      "resources:getResourcesWithTags",
    ),
    getTags: query<NoArgs, Tag[]>("resources:getTags"),
  },
  rsvps: {
    getCurrentUserRsvpEvents: query<NoArgs, EventWithRsvp[]>(
      "rsvps:getCurrentUserRsvpEvents",
    ),
  },
};
