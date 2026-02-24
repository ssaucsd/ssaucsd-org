import { convexPublicQuery } from "@/lib/convex";

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  image_url: string;
  location: string;
  is_all_day?: boolean;
}

export async function getEvents(limit = 4): Promise<Event[]> {
  try {
    return (await convexPublicQuery("events:getForWeb", { limit })) as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getAllEvents(): Promise<Event[]> {
  try {
    return (await convexPublicQuery("events:getForWeb")) as Event[];
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    return (await convexPublicQuery("events:getById", { id })) as Event | null;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function getAllEventIds(): Promise<string[]> {
  try {
    const events = (await convexPublicQuery("events:getAll")) as Event[];
    return events.map((event) => event.id);
  } catch (error) {
    console.error("Error fetching event IDs:", error);
    return [];
  }
}
