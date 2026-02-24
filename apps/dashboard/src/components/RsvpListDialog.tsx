"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "convex/react";
import { clientApi } from "@/lib/convex/clientApi";
import type { EventRsvp } from "@ssaucsd/database";

interface RsvpListDialogProps {
  eventId: string;
  eventTitle: string;
  trigger?: React.ReactElement;
}

export function RsvpListDialog({
  eventId,
  eventTitle,
  trigger,
}: RsvpListDialogProps) {
  const [open, setOpen] = useState(false);

  const rsvps = useQuery(
    clientApi.events.getRsvpsByEventForAdmin,
    open ? { event_id: eventId as never } : "skip",
  ) as EventRsvp[] | undefined;

  const isLoading = open && rsvps === undefined;

  const groupedRsvps = useMemo(() => {
    const items = rsvps ?? [];
    return {
      going: items.filter((rsvp) => rsvp.status === "going"),
      maybe: items.filter((rsvp) => rsvp.status === "maybe"),
      not_going: items.filter((rsvp) => rsvp.status === "not_going"),
    };
  }, [rsvps]);

  const getInitials = (firstName?: string | null, lastName?: string | null) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase() ||
    "??";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "going":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "maybe":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
      case "not_going":
        return "bg-red-500/10 text-red-600 hover:bg-red-500/20";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button variant="ghost" size="icon-sm" title="View RSVPs">
              <HugeiconsIcon icon={UserGroupIcon} className="h-4 w-4" />
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md h-[430px] flex flex-col p-6">
        <DialogHeader>
          <DialogTitle>RSVPs</DialogTitle>
          <DialogDescription className="line-clamp-1">
            {eventTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : !rsvps || rsvps.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>No RSVPs yet</p>
            </div>
          ) : (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {Object.entries(groupedRsvps).map(([status, items]) => {
                  if (items.length === 0) {
                    return null;
                  }

                  return (
                    <div key={status} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className={`capitalize ${getStatusColor(status)}`}
                        >
                          {status.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {items.length}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {items.map((rsvp) => (
                          <div
                            key={rsvp.user_id}
                            className="flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border">
                                <AvatarFallback>
                                  {getInitials(
                                    rsvp.profile?.first_name,
                                    rsvp.profile?.last_name,
                                  )}
                                </AvatarFallback>
                              </Avatar>
                              <div className="grid gap-0.5">
                                <p className="text-sm font-medium leading-none">
                                  {rsvp.profile?.first_name}{" "}
                                  {rsvp.profile?.last_name || ""}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {rsvp.profile?.email}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              {formatDistanceToNow(new Date(rsvp.created_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
