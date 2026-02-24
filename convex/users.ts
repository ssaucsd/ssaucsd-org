import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import {
  findUserByIdentity,
  requireAdmin,
  requireIdentity,
  toProfile,
  upsertUserFromIdentity,
} from "./lib/auth";

export const syncCurrentUser = mutation({
  args: {
    fallback_email: v.optional(v.string()),
    fallback_first_name: v.optional(v.string()),
    fallback_last_name: v.optional(v.string()),
  },
  returns: v.object({
    profile: v.object({
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
  }),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const user = await upsertUserFromIdentity(ctx, identity, {
      email: args.fallback_email,
      firstName: args.fallback_first_name,
      lastName: args.fallback_last_name,
    });
    return { profile: toProfile(user) };
  },
});

export const getFirstName = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await findUserByIdentity(ctx, identity);
    if (!user) {
      return null;
    }

    return user.preferred_name ?? user.first_name;
  },
});

export const getCurrentProfile = query({
  args: {},
  returns: v.union(
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
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await findUserByIdentity(ctx, identity);
    if (!user) {
      return null;
    }

    return toProfile(user);
  },
});

export const getIsAdmin = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await findUserByIdentity(ctx, identity);
    return user?.role === "admin";
  },
});

export const getOnboardingState = query({
  args: {},
  returns: v.object({
    authenticated: v.boolean(),
    profile_exists: v.boolean(),
    is_onboarded: v.boolean(),
  }),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return {
        authenticated: false,
        profile_exists: false,
        is_onboarded: false,
      };
    }

    const user = await findUserByIdentity(ctx, identity);

    return {
      authenticated: true,
      profile_exists: !!user,
      is_onboarded: user?.is_onboarded ?? false,
    };
  },
});

export const listProfiles = query({
  args: {},
  returns: v.array(
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
  ),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const profiles = await ctx.db.query("users").collect();

    return profiles
      .map(toProfile)
      .sort((a, b) =>
        `${a.first_name} ${a.last_name}`.localeCompare(
          `${b.first_name} ${b.last_name}`,
        ),
      );
  },
});

export const completeOnboarding = mutation({
  args: {
    preferred_name: v.string(),
    instrument: v.string(),
    major: v.string(),
    graduation_year: v.number(),
    fallback_email: v.optional(v.string()),
    fallback_first_name: v.optional(v.string()),
    fallback_last_name: v.optional(v.string()),
  },
  returns: v.object({
    profile: v.object({
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
  }),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const user = await upsertUserFromIdentity(ctx, identity, {
      email: args.fallback_email,
      firstName: args.fallback_first_name,
      lastName: args.fallback_last_name,
    });

    await ctx.db.patch(user._id, {
      preferred_name: args.preferred_name.trim(),
      instrument: args.instrument.trim(),
      major: args.major.trim(),
      graduation_year: args.graduation_year,
      is_onboarded: true,
      updated_at: Date.now(),
    });

    const updated = await ctx.db.get(user._id);
    if (!updated) {
      throw new ConvexError("Failed to load updated profile");
    }

    return { profile: toProfile(updated) };
  },
});

export const updateCurrentProfile = mutation({
  args: {
    preferred_name: v.string(),
    major: v.string(),
    graduation_year: v.number(),
  },
  returns: v.object({
    profile: v.object({
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
  }),
  handler: async (ctx, args) => {
    const identity = await requireIdentity(ctx);
    const user = await upsertUserFromIdentity(ctx, identity);

    await ctx.db.patch(user._id, {
      preferred_name: args.preferred_name.trim(),
      major: args.major.trim(),
      graduation_year: args.graduation_year,
      updated_at: Date.now(),
    });

    const updated = await ctx.db.get(user._id);
    if (!updated) {
      throw new ConvexError("Failed to load updated profile");
    }

    return { profile: toProfile(updated) };
  },
});

export const updateProfileByAdmin = mutation({
  args: {
    id: v.id("users"),
    first_name: v.string(),
    last_name: v.string(),
    preferred_name: v.union(v.string(), v.null()),
    instrument: v.union(v.string(), v.null()),
    role: v.union(v.literal("admin"), v.literal("user")),
    major: v.union(v.string(), v.null()),
    graduation_year: v.union(v.number(), v.null()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new ConvexError("Profile not found");
    }

    await ctx.db.patch(args.id, {
      first_name: args.first_name.trim(),
      last_name: args.last_name.trim(),
      preferred_name: args.preferred_name?.trim(),
      instrument: args.instrument?.trim(),
      role: args.role,
      major: args.major?.trim(),
      graduation_year: args.graduation_year ?? undefined,
      updated_at: Date.now(),
    });

    return null;
  },
});

export const deleteProfileByAdmin = mutation({
  args: {
    id: v.id("users"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const rsvps = await ctx.db
      .query("rsvps")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.id))
      .collect();

    await Promise.all(rsvps.map((rsvp) => ctx.db.delete(rsvp._id)));
    await ctx.db.delete(args.id);

    return null;
  },
});
