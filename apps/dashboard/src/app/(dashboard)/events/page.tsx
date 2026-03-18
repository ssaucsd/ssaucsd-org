"use client";

import { Card } from "@/components/ui/card";
import { Calendar } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { EventCard } from "@/components/EventCard";
import { useQuery } from "convex/react";
import { clientApi } from "@/lib/convex/clientApi";
import { DashboardEventsSkeleton } from "@/components/dashboard-skeletons";
import type { EventWithRsvp } from "@ssaucsd/database";

export default function EventsPage() {
  const events = useQuery(clientApi.events.getUpcomingWithRsvp) as
    | EventWithRsvp[]
    | undefined;

  if (events === undefined) {
    return <DashboardEventsSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen w-full p-4 md:p-6 lg:p-8 gap-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-serif">Upcoming Events</h1>
        <p className="text-muted-foreground text-lg">
          Discover what&apos;s happening next with SSA
        </p>
      </div>

      {!events || events.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-muted p-4">
              <HugeiconsIcon
                icon={Calendar}
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No upcoming events</h3>
              <p className="text-muted-foreground">
                Check back soon for new events!
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
