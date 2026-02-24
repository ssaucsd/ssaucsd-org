import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const role = v.union(v.literal("admin"), v.literal("user"));
const rsvpStatus = v.union(
  v.literal("going"),
  v.literal("maybe"),
  v.literal("not_going"),
);

export default defineSchema({
  users: defineTable({
    token_identifier: v.optional(v.string()),
    clerk_subject: v.optional(v.string()),
    legacy_supabase_id: v.optional(v.string()),
    email: v.string(),
    first_name: v.string(),
    last_name: v.string(),
    preferred_name: v.optional(v.string()),
    instrument: v.optional(v.string()),
    role,
    major: v.optional(v.string()),
    graduation_year: v.optional(v.number()),
    is_onboarded: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_token_identifier", ["token_identifier"])
    .index("by_clerk_subject", ["clerk_subject"])
    .index("by_legacy_supabase_id", ["legacy_supabase_id"])
    .index("by_role", ["role"]),

  events: defineTable({
    legacy_supabase_id: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    location: v.string(),
    start_time: v.string(),
    end_time: v.string(),
    image_url: v.string(),
    is_all_day: v.boolean(),
    created_at: v.number(),
    updated_at: v.number(),
  })
    .index("by_start_time", ["start_time"])
    .index("by_legacy_supabase_id", ["legacy_supabase_id"]),

  resources: defineTable({
    legacy_supabase_id: v.optional(v.string()),
    name: v.string(),
    link: v.string(),
    description: v.optional(v.string()),
    is_pinned: v.boolean(),
    created_at: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_is_pinned", ["is_pinned"])
    .index("by_legacy_supabase_id", ["legacy_supabase_id"]),

  tags: defineTable({
    legacy_supabase_id: v.optional(v.string()),
    name: v.string(),
    slug: v.string(),
    display_order: v.number(),
    created_at: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_display_order", ["display_order"])
    .index("by_legacy_supabase_id", ["legacy_supabase_id"]),

  resource_tags: defineTable({
    resource_id: v.id("resources"),
    tag_id: v.id("tags"),
    created_at: v.number(),
  })
    .index("by_resource_id", ["resource_id"])
    .index("by_tag_id", ["tag_id"])
    .index("by_resource_id_and_tag_id", ["resource_id", "tag_id"]),

  rsvps: defineTable({
    legacy_supabase_id: v.optional(v.string()),
    user_id: v.id("users"),
    event_id: v.id("events"),
    status: rsvpStatus,
    created_at: v.number(),
  })
    .index("by_user_id", ["user_id"])
    .index("by_event_id", ["event_id"])
    .index("by_user_id_and_event_id", ["user_id", "event_id"])
    .index("by_legacy_supabase_id", ["legacy_supabase_id"]),
});
