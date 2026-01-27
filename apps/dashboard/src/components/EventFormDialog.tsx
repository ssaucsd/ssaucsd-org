"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Edit02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { type Event } from "@/lib/queries";
import {
  createEvent,
  updateEvent,
  type ActionResult,
} from "@/app/(dashboard)/admin/events/actions";
import { UploadButton } from "@/utils/uploadthing";
import posthog from "posthog-js";

interface EventFormDialogProps {
  event?: Event;
  trigger?: React.ReactElement;
}

export function EventFormDialog({ event, trigger }: EventFormDialogProps) {
  const isEditing = !!event;
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(event?.image_url || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isAllDay, setIsAllDay] = useState(event?.is_all_day ?? false);

  const convertToISO = (datetimeLocal: string): string => {
    if (!datetimeLocal) return "";
    const date = new Date(datetimeLocal);
    return date.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("image_url", imageUrl);

    const startTime = formData.get("start_time") as string;
    const endTime = formData.get("end_time") as string;

    if (isAllDay) {
      const startDate = new Date(startTime);
      startDate.setHours(0, 0, 0, 0);
      formData.set("start_time", startDate.toISOString());

      const endDate = new Date(startTime);
      endDate.setHours(23, 59, 59, 999);
      formData.set("end_time", endDate.toISOString());
    } else {
      if (startTime) formData.set("start_time", convertToISO(startTime));
      if (endTime) formData.set("end_time", convertToISO(endTime));
    }

    startTransition(async () => {
      let result: ActionResult;
      if (isEditing) {
        result = await updateEvent(event.id, formData);
      } else {
        result = await createEvent(formData);
      }

      if (result.success) {
        const eventTitle = formData.get("title") as string;
        const eventLocation = formData.get("location") as string;

        if (isEditing) {
          posthog.capture("admin_event_updated", {
            event_id: event.id,
            event_title: eventTitle,
            event_location: eventLocation,
          });
        } else {
          posthog.capture("admin_event_created", {
            event_title: eventTitle,
            event_location: eventLocation,
          });
        }

        setOpen(false);
        if (!isEditing) {
          setImageUrl("");
          setIsAllDay(false);
        }
      } else {
        setError(result.error || "An error occurred");
        posthog.captureException(new Error(result.error || "Event form error"));
      }
    });
  };

  const formatDateTimeLocal = (isoString: string | undefined) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen && !isEditing) {
          setImageUrl("");
          setIsAllDay(false);
        }
      }}
    >
      <DialogTrigger
        render={
          trigger || (
            <Button>
              <HugeiconsIcon icon={Add01Icon} />
              Add Event
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Event" : "Add Event"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the event details below."
              : "Add a new event for SSA members."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <Input
              id="title"
              name="title"
              placeholder="Event title"
              defaultValue={event?.title || ""}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Event description"
              defaultValue={event?.description || ""}
            />
            <FieldDescription>Optional description</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              name="location"
              placeholder="Event location"
              defaultValue={event?.location || ""}
              required
            />
          </Field>

          <Field>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_all_day"
                name="is_all_day"
                checked={isAllDay}
                onChange={(e) => setIsAllDay(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="is_all_day" className="text-sm font-medium">
                All Day Event
              </label>
            </div>
            <FieldDescription>
              When checked, the event will run from midnight to 11:59 PM
            </FieldDescription>
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="start_time">
                {isAllDay ? "Date" : "Start Time"}
              </FieldLabel>
              <Input
                id="start_time"
                name="start_time"
                type={isAllDay ? "date" : "datetime-local"}
                defaultValue={
                  isAllDay
                    ? event?.start_time
                      ? formatDateTimeLocal(event.start_time).slice(0, 10)
                      : ""
                    : formatDateTimeLocal(event?.start_time)
                }
                required
              />
            </Field>

            {!isAllDay && (
              <Field>
                <FieldLabel htmlFor="end_time">End Time</FieldLabel>
                <Input
                  id="end_time"
                  name="end_time"
                  type="datetime-local"
                  defaultValue={formatDateTimeLocal(event?.end_time)}
                  required
                />
              </Field>
            )}
          </div>

          <Field>
            <FieldLabel>Event Image</FieldLabel>
            {imageUrl ? (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Event preview"
                  className="w-full h-40 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  className="absolute top-2 right-2"
                  onClick={() => setImageUrl("")}
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg">
                {isUploading ? (
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Click below to upload an image
                    </p>
                    <UploadButton
                      endpoint="imageUploader"
                      onUploadBegin={() => {
                        console.log("Upload begin");
                        setIsUploading(true);
                      }}
                      onClientUploadComplete={(res) => {
                        console.log("Upload complete:", res);
                        setIsUploading(false);
                        if (res?.[0]?.url) {
                          setImageUrl(res[0].url);
                        } else if (res?.[0]?.key) {
                          setImageUrl(`https://utfs.io/f/${res[0].key}`);
                        }
                      }}
                      onUploadError={(error: Error) => {
                        console.error("Upload error:", error);
                        setIsUploading(false);
                        setError(`Upload failed: ${error.message}`);
                      }}
                    />
                  </>
                )}
              </div>
            )}
            <FieldDescription>Upload an image for the event</FieldDescription>
          </Field>

          {error && <FieldError>{error}</FieldError>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditEventButton({ event }: { event: Event }) {
  return (
    <EventFormDialog
      event={event}
      trigger={
        <Button variant="ghost" size="icon-sm">
          <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4" />
        </Button>
      }
    />
  );
}
