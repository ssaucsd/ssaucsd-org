"use client";

import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { DashboardSettingsSkeleton } from "@/components/dashboard-skeletons";
import { clientApi } from "@/lib/convex/clientApi";
import { useQuery } from "convex/react";
import type { Profile } from "@ssaucsd/database";

export function SettingsClient() {
  const profile = useQuery(clientApi.users.getCurrentProfile) as
    | Profile
    | null
    | undefined;

  if (profile === undefined) {
    return <DashboardSettingsSkeleton />;
  }

  if (!profile) {
    return (
      <p className="text-sm text-muted-foreground">
        Profile data is unavailable right now.
      </p>
    );
  }

  return <ProfileSettingsForm profile={profile} />;
}
