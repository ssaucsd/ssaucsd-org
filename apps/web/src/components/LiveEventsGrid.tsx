"use client";

import { useQuery } from "convex/react";
import { CalendarX, MapPin } from "lucide-react";
import type { Event } from "@ssaucsd/database";
import { clientApi } from "@/lib/convex/clientApi";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

type LiveEventsGridProps = {
  limit?: number;
};

const formatDate = (event: Event) => {
  const startDate = new Date(event.start_time);
  const endDate = event.end_time ? new Date(event.end_time) : null;
  const dateKey = (date: Date) =>
    date.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  const isMultiDay = endDate ? dateKey(startDate) !== dateKey(endDate) : false;

  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
  const formattedEndDate = endDate
    ? endDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        timeZone: "America/Los_Angeles",
      })
    : null;
  const formattedDate =
    isMultiDay && formattedEndDate
      ? `${formattedStartDate} - ${formattedEndDate}`
      : formattedStartDate;

  const formattedStartTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  });

  const formattedEndTime = endDate
    ? endDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Los_Angeles",
      })
    : null;

  return {
    formattedDate,
    formattedEndDate,
    formattedStartTime,
    formattedEndTime,
    isMultiDay,
  };
};

function EventCard({ event }: { event: Event }) {
  const {
    formattedDate,
    formattedEndDate,
    formattedStartTime,
    formattedEndTime,
    isMultiDay,
  } = formatDate(event);

  return (
    <a href={`/events/${event.id}`} className="block h-full">
      <div className="group h-full flex flex-col gap-0 overflow-hidden rounded-lg border border-border bg-card p-0 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className="relative w-full bg-muted/50">
          {event.image_url ? (
            <img
              src={event.image_url}
              alt={event.title}
              className="w-full h-auto object-contain"
            />
          ) : (
            <div className="flex aspect-4/5 w-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="text-base font-semibold leading-tight tracking-tight">
            {event.title}
          </h3>
          <p className="text-sm font-medium text-primary">
            {formattedDate}
            {" · "}
            {event.is_all_day ? (
              "All Day"
            ) : (
              <>
                {formattedStartTime}
                {formattedEndTime && (
                  <>
                    {" – "}
                    {isMultiDay && formattedEndDate
                      ? `${formattedEndDate}, ${formattedEndTime}`
                      : formattedEndTime}
                  </>
                )}
              </>
            )}
          </p>
          <p className="mt-auto flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
        </div>
      </div>
    </a>
  );
}

function LiveEventsGridInner({ limit }: LiveEventsGridProps) {
  const events = useQuery(
    clientApi.events.getForWeb,
    limit ? { limit } : {},
  ) as Event[] | undefined;

  if (events === undefined) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12 text-muted-foreground">
        <p className="text-xl font-medium">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center gap-4 py-12 text-muted-foreground">
        <CalendarX className="w-12 h-12" />
        <p className="text-xl font-medium">No upcoming events :(</p>
      </div>
    );
  }

  return (
    <>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </>
  );
}

export function LiveEventsGrid({ limit }: LiveEventsGridProps) {
  return (
    <ConvexClientProvider>
      <LiveEventsGridInner limit={limit} />
    </ConvexClientProvider>
  );
}
