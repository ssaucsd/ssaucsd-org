import { ConvexHttpClient } from "convex/browser";

const convexUrl = import.meta.env.PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("PUBLIC_CONVEX_URL is required");
}

const client = new ConvexHttpClient(convexUrl);

export const convexPublicQuery = async (
  name: string,
  args: Record<string, unknown> = {},
) => client.query(name as never, args as never);
