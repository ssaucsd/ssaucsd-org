"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { rsvpToEvent, removeRsvp } from "@/app/actions/rsvp";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import posthog from "posthog-js";

interface RsvpButtonProps {
  eventId: string;
  status: "going" | "maybe" | "not_going" | null;
  className?: string;
  onRsvpChange?: (status: "going" | "maybe" | "not_going" | null) => void;
}

export function RsvpButton({
  eventId,
  status,
  className,
  onRsvpChange,
}: RsvpButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleRsvp = () => {
    startTransition(async () => {
      try {
        if (status === "going") {
          await removeRsvp(eventId);
          onRsvpChange?.(null);
          toast.success("RSVP removed");

          // Track RSVP removed event
          posthog.capture("event_rsvp_removed", {
            event_id: eventId,
          });
        } else {
          await rsvpToEvent(eventId, "going");
          onRsvpChange?.("going");
          toast.success("RSVP'd successfully!");

          // Track RSVP added event
          posthog.capture("event_rsvp_added", {
            event_id: eventId,
            rsvp_status: "going",
          });
        }
      } catch (error) {
        toast.error("Failed to update RSVP");
        console.error(error);
        posthog.captureException(error);
      }
    });
  };

  return (
    <Button
      onClick={handleRsvp}
      disabled={isPending}
      variant={status === "going" ? "outline" : "default"}
      className={cn("w-full transition-all", className)}
    >
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {status === "going" ? "Cancel RSVP" : "RSVP Now"}
    </Button>
  );
}
