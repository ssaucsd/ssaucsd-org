import { ConvexError } from "convex/values";

const emailClaimKeys = [
  "email",
  "email_address",
  "emailAddress",
  "primary_email_address",
  "primaryEmailAddress",
];

const normalizeEmail = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) {
    return null;
  }

  return normalized;
};

const resolveIdentityEmail = (identity: any) => {
  for (const key of emailClaimKeys) {
    const email = normalizeEmail(identity?.[key]);
    if (email) {
      return email;
    }
  }

  return null;
};

const parseName = (name?: string | null) => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return { firstName: "Member", lastName: "" };
  }

  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
};

export const requireIdentity = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required");
  }
  return identity;
};

export const findUserByIdentity = async (ctx: any, identity: any) => {
  if (identity.tokenIdentifier) {
    const byToken = await ctx.db
      .query("users")
      .withIndex("by_token_identifier", (q: any) =>
        q.eq("token_identifier", identity.tokenIdentifier),
      )
      .unique();

    if (byToken) {
      return byToken;
    }
  }

  const clerkSubject = identity.subject;
  if (clerkSubject) {
    const bySubject = await ctx.db
      .query("users")
      .withIndex("by_clerk_subject", (q: any) =>
        q.eq("clerk_subject", clerkSubject),
      )
      .unique();

    if (bySubject) {
      return bySubject;
    }
  }

  const email = resolveIdentityEmail(identity);
  if (!email) {
    return null;
  }

  return ctx.db
    .query("users")
    .withIndex("by_email", (q: any) => q.eq("email", email))
    .unique();
};

export const requireUser = async (ctx: any) => {
  const identity = await requireIdentity(ctx);
  const user = await findUserByIdentity(ctx, identity);

  if (!user) {
    throw new ConvexError("User profile not found");
  }

  return { identity, user };
};

export const requireAdmin = async (ctx: any) => {
  const { identity, user } = await requireUser(ctx);

  if (user.role !== "admin") {
    throw new ConvexError("Admin access required");
  }

  return { identity, user };
};

export const upsertUserFromIdentity = async (ctx: any, identity: any) => {
  const now = Date.now();
  const tokenIdentifier = identity.tokenIdentifier;
  const clerkSubject = identity.subject;
  const email = resolveIdentityEmail(identity);

  if (!email) {
    throw new ConvexError("Missing email in auth token");
  }

  const existing = await findUserByIdentity(ctx, identity);

  if (existing) {
    const patch: Record<string, unknown> = { updated_at: now };

    if (!existing.token_identifier && tokenIdentifier) {
      patch.token_identifier = tokenIdentifier;
    }

    if (!existing.clerk_subject && clerkSubject) {
      patch.clerk_subject = clerkSubject;
    }

    if (existing.email !== email) {
      patch.email = email;
    }

    if (Object.keys(patch).length > 1) {
      await ctx.db.patch(existing._id, patch);
    }

    return (await ctx.db.get(existing._id)) ?? existing;
  }

  const givenName = identity.givenName ?? identity.given_name;
  const familyName = identity.familyName ?? identity.family_name;
  const parsed = parseName(identity.name);

  const userId = await ctx.db.insert("users", {
    token_identifier: tokenIdentifier,
    clerk_subject: clerkSubject,
    email,
    first_name: givenName ?? parsed.firstName,
    last_name: familyName ?? parsed.lastName,
    role: "user",
    is_onboarded: false,
    created_at: now,
    updated_at: now,
  });

  const created = await ctx.db.get(userId);
  if (!created) {
    throw new ConvexError("Failed to create user");
  }

  return created;
};

export const toProfile = (doc: any) => ({
  id: doc._id,
  email: doc.email,
  first_name: doc.first_name,
  last_name: doc.last_name,
  preferred_name: doc.preferred_name ?? null,
  instrument: doc.instrument ?? null,
  role: doc.role,
  major: doc.major ?? null,
  graduation_year: doc.graduation_year ?? null,
  is_onboarded: doc.is_onboarded,
});

export const toEvent = (doc: any) => ({
  id: doc._id,
  title: doc.title,
  description: doc.description ?? null,
  location: doc.location,
  start_time: doc.start_time,
  end_time: doc.end_time,
  image_url: doc.image_url,
  is_all_day: doc.is_all_day,
  created_at: new Date(doc.created_at).toISOString(),
  updated_at: new Date(doc.updated_at).toISOString(),
});

export const toResource = (doc: any) => ({
  id: doc._id,
  name: doc.name,
  link: doc.link,
  description: doc.description ?? null,
  is_pinned: doc.is_pinned,
  created_at: new Date(doc.created_at).toISOString(),
});

export const toTag = (doc: any) => ({
  id: doc._id,
  name: doc.name,
  slug: doc.slug,
  display_order: doc.display_order,
  created_at: new Date(doc.created_at).toISOString(),
});
