import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

const roleValue = (role?: string) => (role === "admin" ? "admin" : "user");
const rsvpStatusValue = (status?: string) => {
  if (status === "maybe" || status === "not_going") {
    return status;
  }

  return "going";
};

const isoToMillis = (value?: string | null) => {
  if (!value) {
    return Date.now();
  }

  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : Date.now();
};

const clearTable = async (ctx: any, table: any) => {
  const docs = await ctx.db.query(table).collect();
  await Promise.all(docs.map((doc: any) => ctx.db.delete(doc._id)));
};

export const importSnapshot = mutation({
  args: {
    secret: v.string(),
    clear_existing: v.optional(v.boolean()),
    snapshot: v.any(),
  },
  returns: v.object({
    users: v.number(),
    events: v.number(),
    resources: v.number(),
    tags: v.number(),
    resource_tags: v.number(),
    rsvps: v.number(),
  }),
  handler: async (ctx, args) => {
    const expected = process.env.MIGRATION_SECRET;
    if (!expected || args.secret !== expected) {
      throw new ConvexError("Invalid migration secret");
    }

    if (args.clear_existing) {
      await clearTable(ctx, "rsvps");
      await clearTable(ctx, "resource_tags");
      await clearTable(ctx, "tags");
      await clearTable(ctx, "resources");
      await clearTable(ctx, "events");
      await clearTable(ctx, "users");
    }

    const snapshot = args.snapshot ?? {};
    const profiles = Array.isArray(snapshot.profiles) ? snapshot.profiles : [];
    const events = Array.isArray(snapshot.events) ? snapshot.events : [];
    const resources = Array.isArray(snapshot.resources)
      ? snapshot.resources
      : [];
    const tags = Array.isArray(snapshot.tags) ? snapshot.tags : [];
    const resourceTags = Array.isArray(snapshot.resource_tags)
      ? snapshot.resource_tags
      : [];
    const rsvps = Array.isArray(snapshot.rsvps) ? snapshot.rsvps : [];

    const userMap = new Map<string, any>();
    const eventMap = new Map<string, any>();
    const resourceMap = new Map<string, any>();
    const tagMap = new Map<string, any>();

    for (const profile of profiles) {
      const email = String(profile.email ?? "").toLowerCase();
      if (!email) {
        continue;
      }

      const existing = await ctx.db
        .query("users")
        .withIndex("by_email", (q: any) => q.eq("email", email))
        .unique();

      const payload = {
        legacy_supabase_id: profile.id ? String(profile.id) : undefined,
        email,
        first_name: String(profile.first_name ?? "Member"),
        last_name: String(profile.last_name ?? ""),
        preferred_name: profile.preferred_name
          ? String(profile.preferred_name)
          : undefined,
        instrument: profile.instrument ? String(profile.instrument) : undefined,
        role: roleValue(profile.role),
        major: profile.major ? String(profile.major) : undefined,
        graduation_year:
          typeof profile.graduation_year === "number"
            ? profile.graduation_year
            : undefined,
        is_onboarded: Boolean(profile.is_onboarded),
        created_at: Date.now(),
        updated_at: Date.now(),
      };

      if (existing) {
        await ctx.db.patch(existing._id, payload);
        userMap.set(String(profile.id), existing._id);
      } else {
        const inserted = await ctx.db.insert("users", payload);
        userMap.set(String(profile.id), inserted);
      }
    }

    for (const event of events) {
      const inserted = await ctx.db.insert("events", {
        legacy_supabase_id: event.id ? String(event.id) : undefined,
        title: String(event.title ?? "Untitled Event"),
        description: event.description ? String(event.description) : undefined,
        location: String(event.location ?? "TBD"),
        start_time: String(event.start_time ?? new Date().toISOString()),
        end_time: String(event.end_time ?? new Date().toISOString()),
        image_url: String(event.image_url ?? ""),
        is_all_day: Boolean(event.is_all_day),
        going_count: 0,
        created_at: isoToMillis(event.created_at),
        updated_at: isoToMillis(event.updated_at),
      });

      if (event.id) {
        eventMap.set(String(event.id), inserted);
      }
    }

    for (const resource of resources) {
      const inserted = await ctx.db.insert("resources", {
        legacy_supabase_id: resource.id ? String(resource.id) : undefined,
        name: String(resource.name ?? "Untitled Resource"),
        link: String(resource.link ?? ""),
        description: resource.description
          ? String(resource.description)
          : undefined,
        is_pinned: Boolean(resource.is_pinned),
        created_at: isoToMillis(resource.created_at),
      });

      if (resource.id) {
        resourceMap.set(String(resource.id), inserted);
      }
    }

    for (const tag of tags) {
      const inserted = await ctx.db.insert("tags", {
        legacy_supabase_id: tag.id ? String(tag.id) : undefined,
        name: String(tag.name ?? "Untitled Tag"),
        slug: String(tag.slug ?? "untitled-tag"),
        display_order:
          typeof tag.display_order === "number" ? tag.display_order : 0,
        created_at: isoToMillis(tag.created_at),
      });

      if (tag.id) {
        tagMap.set(String(tag.id), inserted);
      }
    }

    let resourceTagCount = 0;
    for (const resourceTag of resourceTags) {
      const resourceId = resourceMap.get(String(resourceTag.resource_id));
      const tagId = tagMap.get(String(resourceTag.tag_id));
      if (!resourceId || !tagId) {
        continue;
      }

      const existing = await ctx.db
        .query("resource_tags")
        .withIndex("by_resource_id_and_tag_id", (q: any) =>
          q.eq("resource_id", resourceId).eq("tag_id", tagId),
        )
        .unique();

      if (existing) {
        continue;
      }

      await ctx.db.insert("resource_tags", {
        resource_id: resourceId,
        tag_id: tagId,
        created_at: isoToMillis(resourceTag.created_at),
      });
      resourceTagCount += 1;
    }

    let rsvpCount = 0;
    for (const rsvp of rsvps) {
      const userId = userMap.get(String(rsvp.user_id));
      const eventId = eventMap.get(String(rsvp.event_id));
      if (!userId || !eventId) {
        continue;
      }

      const existing = await ctx.db
        .query("rsvps")
        .withIndex("by_user_id_and_event_id", (q: any) =>
          q.eq("user_id", userId).eq("event_id", eventId),
        )
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, {
          status: rsvpStatusValue(rsvp.status),
        });
        continue;
      }

      await ctx.db.insert("rsvps", {
        legacy_supabase_id: rsvp.id ? String(rsvp.id) : undefined,
        user_id: userId,
        event_id: eventId,
        status: rsvpStatusValue(rsvp.status),
        created_at: isoToMillis(rsvp.created_at),
      });
      rsvpCount += 1;
    }

    const allRsvps = await ctx.db.query("rsvps").collect();
    const goingCountByEvent = allRsvps.reduce((counts, rsvp: any) => {
      if (rsvp.status !== "going") {
        return counts;
      }

      counts.set(rsvp.event_id, (counts.get(rsvp.event_id) ?? 0) + 1);
      return counts;
    }, new Map<any, number>());

    const allEvents = await ctx.db.query("events").collect();
    await Promise.all(
      allEvents.map((event: any) =>
        ctx.db.patch(event._id, {
          going_count: goingCountByEvent.get(event._id) ?? 0,
          updated_at: Date.now(),
        }),
      ),
    );

    return {
      users: profiles.length,
      events: events.length,
      resources: resources.length,
      tags: tags.length,
      resource_tags: resourceTagCount,
      rsvps: rsvpCount,
    };
  },
});

export const backfillEventGoingCounts = mutation({
  args: {
    secret: v.string(),
  },
  returns: v.object({
    updated: v.number(),
  }),
  handler: async (ctx, args) => {
    const expected = process.env.MIGRATION_SECRET;
    if (!expected || args.secret !== expected) {
      throw new ConvexError("Invalid migration secret");
    }

    const [events, rsvps] = await Promise.all([
      ctx.db.query("events").collect(),
      ctx.db.query("rsvps").collect(),
    ]);

    const goingCountByEvent = rsvps.reduce((counts, rsvp: any) => {
      if (rsvp.status !== "going") {
        return counts;
      }

      counts.set(rsvp.event_id, (counts.get(rsvp.event_id) ?? 0) + 1);
      return counts;
    }, new Map<any, number>());

    let updated = 0;

    for (const event of events) {
      const nextCount = goingCountByEvent.get(event._id) ?? 0;
      const currentCount = event.going_count ?? 0;

      if (currentCount === nextCount) {
        continue;
      }

      await ctx.db.patch(event._id, {
        going_count: nextCount,
        updated_at: Date.now(),
      });
      updated += 1;
    }

    return { updated };
  },
});

export const getTableCounts = query({
  args: {},
  returns: v.object({
    users: v.number(),
    events: v.number(),
    resources: v.number(),
    tags: v.number(),
    resource_tags: v.number(),
    rsvps: v.number(),
  }),
  handler: async (ctx) => {
    const [users, events, resources, tags, resourceTags, rsvps] =
      await Promise.all([
        ctx.db.query("users").collect(),
        ctx.db.query("events").collect(),
        ctx.db.query("resources").collect(),
        ctx.db.query("tags").collect(),
        ctx.db.query("resource_tags").collect(),
        ctx.db.query("rsvps").collect(),
      ]);

    return {
      users: users.length,
      events: events.length,
      resources: resources.length,
      tags: tags.length,
      resource_tags: resourceTags.length,
      rsvps: rsvps.length,
    };
  },
});
