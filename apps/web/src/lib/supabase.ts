import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select("id, title, start_time, end_time, image_url, location, is_all_day")
    .gt("end_time", now)
    .order("start_time", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data ?? [];
}

export async function getAllEvents(): Promise<Event[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select("id, title, start_time, end_time, image_url, location, is_all_day")
    .gt("end_time", now)
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data ?? [];
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, description, start_time, end_time, image_url, location, is_all_day",
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data;
}

export async function getAllEventIds(): Promise<string[]> {
  const { data, error } = await supabase.from("events").select("id");

  if (error) {
    console.error("Error fetching event IDs:", error);
    return [];
  }

  return data?.map((event) => event.id) ?? [];
}
