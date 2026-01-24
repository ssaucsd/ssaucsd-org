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
import { Add01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { type ResourceWithTags, type Tag } from "@/lib/queries";
import {
  createResource,
  updateResource,
  type ActionResult,
} from "@/app/(dashboard)/admin/resources/actions";
import posthog from "posthog-js";

interface ResourceFormDialogProps {
  resource?: ResourceWithTags;
  trigger?: React.ReactElement;
  availableTags?: Tag[];
}

export function ResourceFormDialog({
  resource,
  trigger,
  availableTags = [],
}: ResourceFormDialogProps) {
  const isEditing = !!resource;
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    resource?.tags?.map((t) => t.id) || [],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      let result: ActionResult;
      if (isEditing) {
        result = await updateResource(resource.id, formData);
      } else {
        result = await createResource(formData);
      }

      if (result.success) {
        // Track admin resource created/updated
        const resourceName = formData.get("name") as string;
        const resourceLink = formData.get("link") as string;
        const isPinned = formData.get("is_pinned") === "on";

        if (isEditing) {
          posthog.capture("admin_resource_updated", {
            resource_id: resource.id,
            resource_name: resourceName,
            resource_link: resourceLink,
            resource_is_pinned: isPinned,
          });
        } else {
          posthog.capture("admin_resource_created", {
            resource_name: resourceName,
            resource_link: resourceLink,
            resource_is_pinned: isPinned,
          });
        }

        setOpen(false);
      } else {
        setError(result.error || "An error occurred");
        posthog.captureException(
          new Error(result.error || "Resource form error"),
        );
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          trigger || (
            <Button>
              <HugeiconsIcon icon={Add01Icon} />
              Add Resource
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Resource" : "Add Resource"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the resource details below."
              : "Add a new resource to share with members."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              name="name"
              placeholder="Resource name"
              defaultValue={resource?.name || ""}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="link">Link URL</FieldLabel>
            <Input
              id="link"
              name="link"
              type="url"
              placeholder="https://example.com"
              defaultValue={resource?.link || ""}
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of the resource"
              defaultValue={resource?.description || ""}
            />
            <FieldDescription>Optional description</FieldDescription>
          </Field>

          {/* Tags Selection */}
          {availableTags.length > 0 && (
            <Field>
              <FieldLabel>Tags</FieldLabel>
              <div className="flex flex-wrap gap-2 mt-1">
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => {
                        setSelectedTagIds((prev) =>
                          isSelected
                            ? prev.filter((id) => id !== tag.id)
                            : [...prev, tag.id],
                        );
                      }}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
              <FieldDescription>
                Select tags to categorize this resource
              </FieldDescription>
              {/* Hidden input to send selected tag IDs */}
              <input
                type="hidden"
                name="tagIds"
                value={selectedTagIds.join(",")}
              />
            </Field>
          )}

          <Field orientation="horizontal">
            <input
              type="checkbox"
              id="is_pinned"
              name="is_pinned"
              defaultChecked={resource?.is_pinned || false}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            <FieldLabel htmlFor="is_pinned" className="cursor-pointer">
              Pin this resource
            </FieldLabel>
          </Field>

          {error && <FieldError>{error}</FieldError>}

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Saving..."
                : isEditing
                  ? "Save Changes"
                  : "Add Resource"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditResourceButton({
  resource,
  availableTags,
}: {
  resource: ResourceWithTags;
  availableTags?: Tag[];
}) {
  return (
    <ResourceFormDialog
      resource={resource}
      availableTags={availableTags}
      trigger={
        <Button variant="ghost" size="icon-sm">
          <HugeiconsIcon icon={Edit02Icon} className="h-4 w-4" />
        </Button>
      }
    />
  );
}
