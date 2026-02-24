export type Role = "admin" | "user";

export type RsvpStatus = "going" | "maybe" | "not_going";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string;
  start_time: string;
  end_time: string;
  image_url: string;
  is_all_day: boolean;
  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  preferred_name: string | null;
  instrument: string | null;
  role: Role;
  major: string | null;
  graduation_year: number | null;
  is_onboarded: boolean;
};

export type Resource = {
  id: string;
  name: string;
  link: string;
  description: string | null;
  is_pinned: boolean;
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  created_at: string;
};

export type ResourceTag = {
  resource_id: string;
  tag_id: string;
  created_at: string;
};

export type Rsvp = {
  id: string;
  user_id: string;
  event_id: string;
  status: RsvpStatus;
  created_at: string;
};
