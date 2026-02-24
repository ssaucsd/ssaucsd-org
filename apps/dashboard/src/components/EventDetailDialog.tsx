"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { MapPin, Clock } from "@hugeicons/core-free-icons";
import Image from "next/image";
import * as React from "react";
import { RsvpButton } from "./RsvpButton";
import posthog from "posthog-js";
import type { EventWithRsvp } from "@ssaucsd/database";

interface EventDetailDialogProps {
  event: EventWithRsvp;
  children: React.ReactNode;
}

export function EventDetailDialog({ event, children }: EventDetailDialogProps) {
  const [open, setOpen] = React.useState(false);
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

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Track event details viewed when dialog opens
      posthog.capture("event_details_viewed", {
        event_id: event.id,
        event_title: event.title,
        event_location: event.location,
        event_start_time: event.start_time,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div onClick={() => handleOpenChange(true)} className="cursor-pointer">
        {children}
      </div>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 aspect-3/4 md:aspect-auto md:min-h-100 bg-linear-to-br from-primary/20 to-primary/5">
            {event.image_url ? (
              <Image
                src={event.image_url}
                alt={event.title}
                fill
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-4">
                  <div className="text-6xl font-bold text-primary/30">
                    {startDate.getDate()}
                  </div>
                  <div className="text-xl uppercase tracking-wider text-primary/50">
                    {startDate.toLocaleString("default", { month: "short" })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="w-full md:w-1/2 p-6 pt-10 flex flex-col gap-4">
            <DialogTitle className="text-2xl font-serif">
              {event.title}
            </DialogTitle>

            <div className="space-y-3">
              {/* Time */}
              <div className="flex items-center gap-3 text-muted-foreground">
                <HugeiconsIcon icon={Clock} className="h-5 w-5 shrink-0" />
                <span>{formatDateTime()}</span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 text-muted-foreground">
                <HugeiconsIcon icon={MapPin} className="h-5 w-5 shrink-0" />
                <span>{event.location}</span>
              </div>

              <RsvpButton eventId={event.id} status={event.rsvp_status} />
            </div>

            {/* Description */}
            {event.description && (
              <div className="pt-4 border-t border-border/50">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
