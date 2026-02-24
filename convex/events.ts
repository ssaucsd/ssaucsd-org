import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { findUserByIdentity, requireAdmin, toEvent } from "./lib/auth";

const eventValidator = v.object({
  id: v.id("events"),
  title: v.string(),
  description: v.union(v.string(), v.null()),
  location: v.string(),
  start_time: v.string(),
  end_time: v.string(),
  image_url: v.string(),
  is_all_day: v.boolean(),
  created_at: v.string(),
  updated_at: v.string(),
});

const eventWithRsvpValidator = v.object({
  id: v.id("events"),
  title: v.string(),
  description: v.union(v.string(), v.null()),
  location: v.string(),
  start_time: v.string(),
  end_time: v.string(),
  image_url: v.string(),
  is_all_day: v.boolean(),
  created_at: v.string(),
  updated_at: v.string(),
  rsvp_status: v.union(
    v.literal("going"),
    v.literal("maybe"),
    v.literal("not_going"),
    v.null(),
  ),
  rsvp_count: v.number(),
});

const getRsvpsByEvent = async (ctx: any, eventId: any) =>
  ctx.db
    .query("rsvps")
    .withIndex("by_event_id", (q: any) => q.eq("event_id", eventId))
    .collect();

const sortEventsByStartTime = (events: any[]) =>
  events.sort((a, b) => a.start_time.localeCompare(b.start_time));

const getUpcomingEvents = async (ctx: any, now: string) =>
  sortEventsByStartTime(
    await ctx.db
      .query("events")
      .withIndex("by_end_time", (q: any) => q.gte("end_time", now))
      .collect(),
  );

export const getAll = query({
  args: {},
  returns: v.array(eventValidator),
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .withIndex("by_start_time")
      .collect();

    return events.map(toEvent);
  },
});

export const getUpcoming = query({
  args: {},
  returns: v.array(eventValidator),
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const events = await getUpcomingEvents(ctx, now);
    return events.map(toEvent);
  },
});

export const getUpcomingWithRsvp = query({
  args: {},
  returns: v.array(eventWithRsvpValidator),
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const identity = await ctx.auth.getUserIdentity();
    const user = identity ? await findUserByIdentity(ctx, identity) : null;
    const events = await getUpcomingEvents(ctx, now);

    const userRsvps = user
      ? await ctx.db
          .query("rsvps")
          .withIndex("by_user_id", (q: any) => q.eq("user_id", user._id))
          .collect()
      : [];

    const rsvpByEventId = userRsvps.reduce((map, rsvp: any) => {
      map.set(rsvp.event_id, rsvp.status);
      return map;
    }, new Map<any, "going" | "maybe" | "not_going">());

    return events.map((event: any) => ({
      ...toEvent(event),
      rsvp_status: rsvpByEventId.get(event._id) ?? null,
      rsvp_count: event.going_count ?? 0,
    }));
  },
});

export const getById = query({
  args: {
    id: v.id("events"),
  },
  returns: v.union(eventValidator, v.null()),
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) {
      return null;
    }

    return toEvent(event);
  },
});

export const getForWeb = query({
  args: {
    limit: v.optional(v.number()),
  },
  returns: v.array(eventValidator),
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const upcoming = await getUpcomingEvents(ctx, now);

    if (args.limit) {
      return upcoming.slice(0, args.limit).map(toEvent);
    }

    return upcoming.map(toEvent);
  },
});

export const createByAdmin = mutation({
  args: {
    title: v.string(),
    description: v.union(v.string(), v.null()),
    location: v.string(),
    start_time: v.string(),
    end_time: v.string(),
    image_url: v.string(),
    is_all_day: v.boolean(),
  },
  returns: v.id("events"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return ctx.db.insert("events", {
      ...args,
      description: args.description ?? undefined,
      going_count: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    });
  },
});

export const updateByAdmin = mutation({
  args: {
    id: v.id("events"),
    title: v.string(),
    description: v.union(v.string(), v.null()),
    location: v.string(),
    start_time: v.string(),
    end_time: v.string(),
    image_url: v.string(),
    is_all_day: v.boolean(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new ConvexError("Event not found");
    }

    await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description ?? undefined,
      location: args.location,
      start_time: args.start_time,
      end_time: args.end_time,
      image_url: args.image_url,
      is_all_day: args.is_all_day,
      updated_at: Date.now(),
    });

    return null;
  },
});

export const deleteByAdmin = mutation({
  args: {
    id: v.id("events"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const rsvps = await getRsvpsByEvent(ctx, args.id);
    await Promise.all(rsvps.map((rsvp: any) => ctx.db.delete(rsvp._id)));

    await ctx.db.delete(args.id);

    return null;
  },
});

export const getRsvpsByEventForAdmin = query({
  args: {
    event_id: v.id("events"),
  },
  returns: v.array(
    v.object({
      user_id: v.id("users"),
      status: v.union(
        v.literal("going"),
        v.literal("maybe"),
        v.literal("not_going"),
      ),
      created_at: v.string(),
      profile: v.union(
        v.object({
          id: v.id("users"),
          email: v.string(),
          first_name: v.string(),
          last_name: v.string(),
          preferred_name: v.union(v.string(), v.null()),
          instrument: v.union(v.string(), v.null()),
          role: v.union(v.literal("admin"), v.literal("user")),
          major: v.union(v.string(), v.null()),
          graduation_year: v.union(v.number(), v.null()),
          is_onboarded: v.boolean(),
        }),
        v.null(),
      ),
    }),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const rsvps = await getRsvpsByEvent(ctx, args.event_id);

    const enriched = await Promise.all(
      rsvps.map(async (rsvp: any) => {
        const profile = await ctx.db.get(rsvp.user_id);

        return {
          user_id: rsvp.user_id,
          status: rsvp.status,
          created_at: new Date(rsvp.created_at).toISOString(),
          profile: profile
            ? {
                id: profile._id,
                email: profile.email,
                first_name: profile.first_name,
                last_name: profile.last_name,
                preferred_name: profile.preferred_name ?? null,
                instrument: profile.instrument ?? null,
                role: profile.role,
                major: profile.major ?? null,
                graduation_year: profile.graduation_year ?? null,
                is_onboarded: profile.is_onboarded,
              }
            : null,
        };
      }),
    );

    return enriched.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
  },
});
