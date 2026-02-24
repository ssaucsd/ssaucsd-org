"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EventDetailDialog } from "@/components/EventDetailDialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { MapPin, Clock } from "@hugeicons/core-free-icons";
import Image from "next/image";
import type { EventWithRsvp } from "@ssaucsd/database";

interface EventCardProps {
  event: EventWithRsvp;
}

export function EventCard({ event }: EventCardProps) {
  const startDate = new Date(event.start_time);
  const endDate = new Date(event.end_time);
  const isMultiDay =
    startDate.getFullYear() !== endDate.getFullYear() ||
    startDate.getMonth() !== endDate.getMonth() ||
    startDate.getDate() !== endDate.getDate();

  const formatDateTime = () => {
    const startDateStr = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const endDateStr = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (event.is_all_day) {
      return isMultiDay
        ? `${startDateStr} - ${endDateStr} · All Day`
        : `${startDateStr} · All Day`;
    }
    const startTimeStr = startDate
      .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      .replace(" ", "");
    const endTimeStr = endDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    return isMultiDay
      ? `${startDateStr}, ${startTimeStr} - ${endDateStr}, ${endTimeStr}`
      : `${startDateStr}, ${startTimeStr} - ${endTimeStr}`;
  };

  return (
    <EventDetailDialog event={event}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 p-0 h-full">
        {/* Event Image */}
        <div className="relative aspect-3/4 overflow-hidden bg-linear-to-br from-primary/20 to-primary/5">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-5xl font-bold text-primary/30">
                  {startDate.getDate()}
                </div>
                <div className="text-lg uppercase tracking-wider text-primary/50">
                  {startDate.toLocaleString("default", { month: "short" })}
                </div>
              </div>
            </div>
          )}

          {/* Date Badge */}
          <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-md">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                {startDate.toLocaleString("default", { month: "short" })}
              </div>
              <div className="text-2xl font-bold text-foreground leading-none">
                {startDate.getDate()}
              </div>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <CardContent className="p-5 space-y-4">
          <h3 className="text-xl font-serif leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>

          <div className="space-y-2 pt-2 border-t border-border/50">
            {/* Time */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HugeiconsIcon icon={Clock} className="h-4 w-4 shrink-0" />
              <span>{formatDateTime()}</span>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <HugeiconsIcon icon={MapPin} className="h-4 w-4 shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </EventDetailDialog>
  );
}
