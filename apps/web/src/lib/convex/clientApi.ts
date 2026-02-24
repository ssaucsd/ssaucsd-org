import type { Event } from "@ssaucsd/database";
import { makeFunctionReference } from "convex/server";

const query = <Args extends Record<string, unknown>, ReturnValue>(
  name: string,
) => makeFunctionReference<"query", Args, ReturnValue>(name);

export const clientApi = {
  events: {
    getForWeb: query<{ limit?: number }, Event[]>("events:getForWeb"),
    getById: query<{ id: string }, Event | null>("events:getById"),
  },
};
