"use client";

import { useQuery } from "convex/react";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "@ssaucsd/database";
import { clientApi } from "@/lib/convex/clientApi";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";

type LiveEventDetailProps = {
  id: string;
  initialEvent: Event;
};

const formatEventTime = (event: Event) => {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  const dateKey = (date: Date) =>
    date.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  const isMultiDay = dateKey(startDate) !== dateKey(endDate);

  const formattedStartDate = startDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
  const formattedEndDate = endDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });
  const formattedDate = isMultiDay
    ? `${formattedStartDate} - ${formattedEndDate}`
    : formattedStartDate;

  const formattedStartTime = startDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  });

  const formattedEndTime = endDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Los_Angeles",
  });

  return {
    formattedDate,
    formattedEndDate,
    formattedStartTime,
    formattedEndTime,
    isMultiDay,
  };
};

function LiveEventDetailInner({ id, initialEvent }: LiveEventDetailProps) {
  const event = useQuery(clientApi.events.getById, { id: id as never }) as
    | Event
    | null
    | undefined;
  const currentEvent = event === undefined ? initialEvent : event;

  if (!currentEvent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <p>Event details unavailable.</p>
      </div>
    );
  }

  const {
    formattedDate,
    formattedEndDate,
    formattedStartTime,
    formattedEndTime,
    isMultiDay,
  } = formatEventTime(currentEvent);

  return (
    <>
      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl leading-tight">
          {currentEvent.title}
        </h1>
      </header>

      <div className="flex flex-col gap-4 mb-10 pb-10 border-b border-border/50">
        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
          </div>
          <span className="text-base font-medium">{formattedDate}</span>
        </div>

        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <span className="text-base font-medium">
            {currentEvent.is_all_day
              ? "All Day"
              : isMultiDay
                ? `${formattedStartTime} – ${formattedEndDate}, ${formattedEndTime}`
                : `${formattedStartTime} – ${formattedEndTime}`}
          </span>
        </div>

        <div className="flex items-center gap-3 text-foreground">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <span className="text-base font-medium">{currentEvent.location}</span>
        </div>
      </div>

      {currentEvent.description && (
        <section className="flex-1">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            About this event
          </h2>
          <div className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {currentEvent.description}
          </div>
        </section>
      )}

      <footer className="mt-12 pt-8 border-t border-border/50">
        <p className="text-muted-foreground mb-3">We hope to see you there!</p>
        <a
          href="/events"
          className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4"
        >
          View all upcoming events
          <ArrowRight className="h-4 w-4" />
        </a>
      </footer>
    </>
  );
}

export function LiveEventDetail({ id, initialEvent }: LiveEventDetailProps) {
  return (
    <ConvexClientProvider>
      <LiveEventDetailInner id={id} initialEvent={initialEvent} />
    </ConvexClientProvider>
  );
}
