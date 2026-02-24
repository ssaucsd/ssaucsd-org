import "server-only";

import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { cache } from "react";

const convexUrl =
  process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL ?? "";

const serializeError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return { value: error };
  }

  const details: Record<string, unknown> = {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };

  Object.getOwnPropertyNames(error).forEach((key) => {
    if (key in details) {
      return;
    }

    details[key] = (error as unknown as Record<string, unknown>)[key];
  });

  return details;
};

const parseJwtPayload = (token: string) => {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    return JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8"),
    ) as Record<string, unknown>;
  } catch {
    return null;
  }
};

const validateConvexJwt = (token: string) => {
  const payload = parseJwtPayload(token);
  if (!payload) {
    return;
  }

  const audience = payload.aud;
  const audiences = Array.isArray(audience)
    ? audience.filter((value): value is string => typeof value === "string")
    : typeof audience === "string"
      ? [audience]
      : [];

  if (!audiences.includes("convex")) {
    throw new Error(
      "Clerk convex JWT token is missing aud='convex'. Update Clerk JWT template 'convex'.",
    );
  }

  const expectedIssuer = process.env.CLERK_JWT_ISSUER_DOMAIN;
  const tokenIssuer = typeof payload.iss === "string" ? payload.iss : null;

  if (expectedIssuer && tokenIssuer && tokenIssuer !== expectedIssuer) {
    throw new Error(
      `Clerk convex JWT issuer mismatch (token iss='${tokenIssuer}', env='${expectedIssuer}').`,
    );
  }
};

const createPublicClient = cache(async () => {
  if (!convexUrl) {
    throw new Error(
      "Convex URL is not configured. Set NEXT_PUBLIC_CONVEX_URL (or CONVEX_URL).",
    );
  }

  return new ConvexHttpClient(convexUrl);
});

const createAuthedClient = cache(async () => {
  if (!convexUrl) {
    throw new Error(
      "Convex URL is not configured. Set NEXT_PUBLIC_CONVEX_URL (or CONVEX_URL).",
    );
  }

  const client = new ConvexHttpClient(convexUrl);

  const session = await auth();
  const token = await session.getToken({ template: "convex" });

  if (!token) {
    throw new Error(
      "Missing Clerk convex JWT token. Ensure JWT template 'convex' exists and middleware is active.",
    );
  }

  validateConvexJwt(token);
  client.setAuth(token);

  return client;
});

export const convexQuery = async <T = unknown>(
  name: string,
  args: Record<string, unknown> = {},
): Promise<T> => {
  const client = await createAuthedClient();
  try {
    return (await client.query(name as never, args as never)) as T;
  } catch (error) {
    console.error(`Convex query failed: ${name}`, serializeError(error));
    throw error;
  }
};

export const convexMutation = async <T = unknown>(
  name: string,
  args: Record<string, unknown> = {},
): Promise<T> => {
  const client = await createAuthedClient();
  try {
    return (await client.mutation(name as never, args as never)) as T;
  } catch (error) {
    console.error(`Convex mutation failed: ${name}`, serializeError(error));
    throw error;
  }
};

export const convexPublicQuery = async <T = unknown>(
  name: string,
  args: Record<string, unknown> = {},
): Promise<T> => {
  const client = await createPublicClient();
  return client.query(name as never, args as never) as Promise<T>;
};
