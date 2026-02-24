import "server-only";

import { convexQuery } from "./convex/server";

const withFallback = async <T>(run: () => Promise<T>, fallback: T) => {
  try {
    return await run();
  } catch {
    return fallback;
  }
};

export const getIsAdmin = async () =>
  withFallback(
    () => convexQuery("users:getIsAdmin") as Promise<boolean>,
    false,
  );
