"use client";

import { Card, CardContent } from "@/components/ui/card";
import { type EventWithRsvp } from "@/lib/queries";
import { EventDetailDialog } from "@/components/EventDetailDialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { MapPin, Clock } from "@hugeicons/core-free-icons";

interface HomeEventCardProps {
  event: EventWithRsvp;
}

export function HomeEventCard({ event }: HomeEventCardProps) {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);

  const formatDateTime = () => {
    const dateStr = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const startTimeStr = startDate
      .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      .replace(" ", "");
    const endTimeStr = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
  };

  return (
    <EventDetailDialog event={event}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 p-0 h-full">
        <CardContent className="p-0 flex h-full">
          {/* Date Badge Section */}
          <div className="flex items-center justify-center px-4 py-5 bg-linear-to-br from-primary/20 to-primary/5">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                {startDate.toLocaleString("default", { month: "short" })}
              </div>
              <div className="text-2xl font-bold text-foreground leading-none">
                {startDate.getDate()}
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="p-5 space-y-3 flex-1">
            <h3 className="text-lg font-serif leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {event.title}
            </h3>

            <div className="space-y-1.5 pt-2 border-t border-border/50">
              {/* Time */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Clock} className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{formatDateTime()}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <HugeiconsIcon icon={MapPin} className="h-4 w-4 shrink-0" />
                <span className="line-clamp-1">{event.location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </EventDetailDialog>
  );
}
