import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { requireAdmin, toResource, toTag } from "./lib/auth";

const tagValidator = v.object({
  id: v.id("tags"),
  name: v.string(),
  slug: v.string(),
  display_order: v.number(),
  created_at: v.string(),
});

const resourceValidator = v.object({
  id: v.id("resources"),
  name: v.string(),
  link: v.string(),
  description: v.union(v.string(), v.null()),
  is_pinned: v.boolean(),
  created_at: v.string(),
});

const resourceWithTagsValidator = v.object({
  id: v.id("resources"),
  name: v.string(),
  link: v.string(),
  description: v.union(v.string(), v.null()),
  is_pinned: v.boolean(),
  created_at: v.string(),
  tags: v.array(tagValidator),
});

const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const sortTags = (tags: any[]) =>
  tags.sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }

    return a.name.localeCompare(b.name);
  });

const getAllResourcesSorted = async (ctx: any) => {
  const resources = await ctx.db.query("resources").collect();

  return resources.sort((a: any, b: any) => {
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });
};

const buildResourcesWithTags = async (ctx: any, resources: any[]) => {
  if (!resources.length) {
    return [];
  }

  const resourceIdSet = new Set(resources.map((resource) => resource._id));

  const [links, tags] = await Promise.all([
    ctx.db.query("resource_tags").collect(),
    ctx.db.query("tags").withIndex("by_display_order").collect(),
  ]);

  const tagsById = sortTags(tags.map(toTag)).reduce((map, tag) => {
    map.set(tag.id, tag);
    return map;
  }, new Map<any, any>());

  const tagsByResourceId = links.reduce((map, link: any) => {
    if (!resourceIdSet.has(link.resource_id)) {
      return map;
    }

    const tag = tagsById.get(link.tag_id);
    if (!tag) {
      return map;
    }

    const existing = map.get(link.resource_id) ?? [];
    existing.push(tag);
    map.set(link.resource_id, existing);
    return map;
  }, new Map<any, any[]>());

  return resources.map((resource: any) => ({
    ...toResource(resource),
    tags: sortTags([...(tagsByResourceId.get(resource._id) ?? [])]),
  }));
};

export const getResources = query({
  args: {},
  returns: v.array(resourceValidator),
  handler: async (ctx) => {
    const resources = await getAllResourcesSorted(ctx);
    return resources.map(toResource);
  },
});

export const getPinnedResources = query({
  args: {},
  returns: v.array(resourceValidator),
  handler: async (ctx) => {
    const resources = await ctx.db
      .query("resources")
      .withIndex("by_is_pinned", (q: any) => q.eq("is_pinned", true))
      .collect();

    return resources
      .map(toResource)
      .sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const getTags = query({
  args: {},
  returns: v.array(tagValidator),
  handler: async (ctx) => {
    const tags = await ctx.db
      .query("tags")
      .withIndex("by_display_order")
      .collect();

    return sortTags(tags.map(toTag));
  },
});

export const getResourcesWithTags = query({
  args: {},
  returns: v.array(resourceWithTagsValidator),
  handler: async (ctx) => {
    const resources = await getAllResourcesSorted(ctx);
    return buildResourcesWithTags(ctx, resources);
  },
});

export const getPinnedResourcesWithTags = query({
  args: {},
  returns: v.array(resourceWithTagsValidator),
  handler: async (ctx) => {
    const resources = await ctx.db
      .query("resources")
      .withIndex("by_is_pinned", (q: any) => q.eq("is_pinned", true))
      .collect();

    const sorted = resources.sort((a: any, b: any) =>
      a.name.localeCompare(b.name),
    );

    return buildResourcesWithTags(ctx, sorted);
  },
});

export const createResourceByAdmin = mutation({
  args: {
    name: v.string(),
    link: v.string(),
    description: v.union(v.string(), v.null()),
    is_pinned: v.boolean(),
    tag_ids: v.array(v.id("tags")),
  },
  returns: v.id("resources"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const resourceId = await ctx.db.insert("resources", {
      name: args.name.trim(),
      link: args.link.trim(),
      description: args.description?.trim(),
      is_pinned: args.is_pinned,
      created_at: Date.now(),
    });

    await Promise.all(
      args.tag_ids.map((tagId) =>
        ctx.db.insert("resource_tags", {
          resource_id: resourceId,
          tag_id: tagId,
          created_at: Date.now(),
        }),
      ),
    );

    return resourceId;
  },
});

export const updateResourceByAdmin = mutation({
  args: {
    id: v.id("resources"),
    name: v.string(),
    link: v.string(),
    description: v.union(v.string(), v.null()),
    is_pinned: v.boolean(),
    tag_ids: v.array(v.id("tags")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new ConvexError("Resource not found");
    }

    await ctx.db.patch(args.id, {
      name: args.name.trim(),
      link: args.link.trim(),
      description: args.description?.trim(),
      is_pinned: args.is_pinned,
    });

    const existingLinks = await ctx.db
      .query("resource_tags")
      .withIndex("by_resource_id", (q: any) => q.eq("resource_id", args.id))
      .collect();

    await Promise.all(
      existingLinks.map((link: any) => ctx.db.delete(link._id)),
    );

    await Promise.all(
      args.tag_ids.map((tagId) =>
        ctx.db.insert("resource_tags", {
          resource_id: args.id,
          tag_id: tagId,
          created_at: Date.now(),
        }),
      ),
    );

    return null;
  },
});

export const deleteResourceByAdmin = mutation({
  args: {
    id: v.id("resources"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const links = await ctx.db
      .query("resource_tags")
      .withIndex("by_resource_id", (q: any) => q.eq("resource_id", args.id))
      .collect();

    await Promise.all(links.map((link: any) => ctx.db.delete(link._id)));
    await ctx.db.delete(args.id);

    return null;
  },
});

export const createTagByAdmin = mutation({
  args: {
    name: v.string(),
  },
  returns: v.id("tags"),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const name = args.name.trim();
    const slug = generateSlug(name);

    const existing = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q: any) => q.eq("slug", slug))
      .unique();

    if (existing) {
      throw new ConvexError("A tag with this name already exists");
    }

    const currentTags = await ctx.db.query("tags").collect();
    const maxOrder = currentTags.reduce(
      (acc: number, tag: any) => Math.max(acc, tag.display_order),
      0,
    );

    return ctx.db.insert("tags", {
      name,
      slug,
      display_order: maxOrder + 1,
      created_at: Date.now(),
    });
  },
});

export const updateTagByAdmin = mutation({
  args: {
    id: v.id("tags"),
    name: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new ConvexError("Tag not found");
    }

    const name = args.name.trim();
    const slug = generateSlug(name);

    const collision = await ctx.db
      .query("tags")
      .withIndex("by_slug", (q: any) => q.eq("slug", slug))
      .unique();

    if (collision && collision._id !== args.id) {
      throw new ConvexError("A tag with this name already exists");
    }

    await ctx.db.patch(args.id, {
      name,
      slug,
    });

    return null;
  },
});

export const deleteTagByAdmin = mutation({
  args: {
    id: v.id("tags"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const links = await ctx.db
      .query("resource_tags")
      .withIndex("by_tag_id", (q: any) => q.eq("tag_id", args.id))
      .collect();

    await Promise.all(links.map((link: any) => ctx.db.delete(link._id)));
    await ctx.db.delete(args.id);

    return null;
  },
});
