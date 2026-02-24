import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import {
  findUserByIdentity,
  toEvent,
  upsertUserFromIdentity,
} from "./lib/auth";

const rsvpStatus = v.union(
  v.literal("going"),
  v.literal("maybe"),
  v.literal("not_going"),
);

const isGoing = (status: "going" | "maybe" | "not_going") => status === "going";

const updateEventGoingCount = async (ctx: any, eventId: any, delta: number) => {
  if (!delta) {
    return;
  }

  const event = await ctx.db.get(eventId);
  if (!event) {
    throw new ConvexError("Event not found");
  }

  await ctx.db.patch(eventId, {
    going_count: Math.max(0, (event.going_count ?? 0) + delta),
    updated_at: Date.now(),
  });
};

export const upsertCurrentUserRsvp = mutation({
  args: {
    event_id: v.id("events"),
    status: rsvpStatus,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const user = await upsertUserFromIdentity(ctx, identity);

    const event = await ctx.db.get(args.event_id);
    if (!event) {
      throw new ConvexError("Event not found");
    }

    const existing = await ctx.db
      .query("rsvps")
      .withIndex("by_user_id_and_event_id", (q: any) =>
        q.eq("user_id", user._id).eq("event_id", args.event_id),
      )
      .unique();

    if (existing) {
      const delta =
        Number(isGoing(args.status)) - Number(isGoing(existing.status));
      await updateEventGoingCount(ctx, args.event_id, delta);
      await ctx.db.patch(existing._id, {
        status: args.status,
      });
      return null;
    }

    await ctx.db.insert("rsvps", {
      user_id: user._id,
      event_id: args.event_id,
      status: args.status,
      created_at: Date.now(),
    });
    await updateEventGoingCount(
      ctx,
      args.event_id,
      Number(isGoing(args.status)),
    );

    return null;
  },
});

export const removeCurrentUserRsvp = mutation({
  args: {
    event_id: v.id("events"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }

    const user = await findUserByIdentity(ctx, identity);
    if (!user) {
      return null;
    }

    const existing = await ctx.db
      .query("rsvps")
      .withIndex("by_user_id_and_event_id", (q: any) =>
        q.eq("user_id", user._id).eq("event_id", args.event_id),
      )
      .unique();

    if (!existing) {
      return null;
    }

    await updateEventGoingCount(
      ctx,
      args.event_id,
      -Number(isGoing(existing.status)),
    );
    await ctx.db.delete(existing._id);

    return null;
  },
});

export const getCurrentUserRsvp = query({
  args: {
    event_id: v.id("events"),
  },
  returns: v.union(rsvpStatus, v.null()),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await findUserByIdentity(ctx, identity);
    if (!user) {
      return null;
    }

    const existing = await ctx.db
      .query("rsvps")
      .withIndex("by_user_id_and_event_id", (q: any) =>
        q.eq("user_id", user._id).eq("event_id", args.event_id),
      )
      .unique();

    return existing?.status ?? null;
  },
});

export const getCurrentUserRsvpEvents = query({
  args: {},
  returns: v.array(
    v.object({
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
      rsvp_status: rsvpStatus,
      rsvp_count: v.number(),
    }),
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await findUserByIdentity(ctx, identity);
    if (!user) {
      return [];
    }

    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_user_id", (q: any) => q.eq("user_id", user._id))
      .collect();

    const selected = rsvps.filter(
      (rsvp: any) => rsvp.status === "going" || rsvp.status === "maybe",
    );

    const withEvents = await Promise.all(
      selected.map(async (rsvp: any) => {
        const event = await ctx.db.get(rsvp.event_id);
        if (!event) {
          return null;
        }

        return {
          ...toEvent(event),
          rsvp_status: rsvp.status,
          rsvp_count: event.going_count ?? 0,
        };
      }),
    );

    const now = Date.now();

    return withEvents
      .filter(Boolean)
      .filter((event: any) => new Date(event.end_time).getTime() >= now)
      .sort(
        (a: any, b: any) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
      );
  },
});
