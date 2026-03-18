"use client";

import { Card, CardContent } from "@/components/ui/card";
import { EventFormDialog, EditEventButton } from "@/components/EventFormDialog";
import { DeleteEventDialog } from "@/components/DeleteEventDialog";
import { RsvpListDialog } from "@/components/RsvpListDialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar, MapPin, Clock } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useQuery } from "convex/react";
import { clientApi } from "@/lib/convex/clientApi";
import { AdminEventsSkeleton } from "@/components/dashboard-skeletons";
import type { Event } from "@ssaucsd/database";

export function EventsAdminClient() {
  const events = useQuery(clientApi.events.getAll) as Event[] | undefined;

  if (events === undefined) {
    return <AdminEventsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            {events.length} event{events.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <EventFormDialog />
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-muted p-4">
              <HugeiconsIcon
                icon={Calendar}
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No events yet</h3>
              <p className="text-muted-foreground">
                Add your first event to get started.
              </p>
            </div>
            <EventFormDialog />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
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
                .toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })
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
              <Card
                key={event.id}
                className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 p-0"
              >
                {/* Event Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-linear-to-br from-primary/20 to-primary/5">
                  {event.image_url ? (
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-5xl font-bold text-primary/30">
                          {startDate.getDate()}
                        </div>
                        <div className="text-lg uppercase tracking-wider text-primary/50">
                          {startDate.toLocaleString("default", {
                            month: "short",
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Date Badge */}
                  <div className="absolute top-3 left-3 bg-background/95 backdrop-blur-sm rounded-lg p-2 shadow-md">
                    <div className="text-center">
                      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                        {startDate.toLocaleString("default", {
                          month: "short",
                        })}
                      </div>
                      <div className="text-2xl font-bold text-foreground leading-none">
                        {startDate.getDate()}
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/95 backdrop-blur-sm rounded-lg p-1 shadow-md">
                    <RsvpListDialog
                      eventId={event.id}
                      eventTitle={event.title}
                    />
                    <EditEventButton event={event} />
                    <DeleteEventDialog
                      eventId={event.id}
                      eventTitle={event.title}
                    />
                  </div>
                </div>

                {/* Event Details */}
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2">
                    <h3 className="text-lg font-serif leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    {event.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {event.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/50">
                    {/* Time */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HugeiconsIcon
                        icon={Clock}
                        className="h-4 w-4 shrink-0"
                      />
                      <span>{formatDateTime()}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <HugeiconsIcon
                        icon={MapPin}
                        className="h-4 w-4 shrink-0"
                      />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
