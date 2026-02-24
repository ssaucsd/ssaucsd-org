"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResourceFormDialog,
  EditResourceButton,
} from "@/components/ResourceFormDialog";
import { DeleteResourceDialog } from "@/components/DeleteResourceDialog";
import { TagsManager } from "./TagsManager";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link01Icon, PinIcon, File01Icon } from "@hugeicons/core-free-icons";
import { useQuery } from "convex/react";
import { clientApi } from "@/lib/convex/clientApi";
import { DashboardLoadingSpinner } from "@/components/dashboard-loading-spinner";
import type { ResourceWithTags, Tag } from "@ssaucsd/database";

export function ResourcesAdminClient() {
  const resources = useQuery(clientApi.resources.getResourcesWithTags) as
    | ResourceWithTags[]
    | undefined;
  const tags = useQuery(clientApi.resources.getTags) as Tag[] | undefined;

  if (resources === undefined || tags === undefined) {
    return <DashboardLoadingSpinner />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      {/* Main content */}
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {resources.length} resource{resources.length !== 1 ? "s" : ""}{" "}
              total
            </p>
          </div>
          <ResourceFormDialog availableTags={tags} />
        </div>

        {/* Resources List */}
        {resources.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-4">
                <HugeiconsIcon
                  icon={File01Icon}
                  className="h-8 w-8 text-muted-foreground"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No resources yet</h3>
                <p className="text-muted-foreground">
                  Add your first resource to get started.
                </p>
              </div>
              <ResourceFormDialog availableTags={tags} />
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {resources.map((resource) => (
              <Card key={resource.id} className="p-0 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    {/* Resource Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="rounded-lg bg-primary/10 p-2 shrink-0">
                        <HugeiconsIcon
                          icon={resource.is_pinned ? PinIcon : Link01Icon}
                          className={`h-5 w-5 text-primary ${resource.is_pinned ? "rotate-45" : ""}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold truncate">
                            {resource.name}
                          </h3>
                          {resource.is_pinned && (
                            <Badge variant="secondary" className="text-xs">
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-primary truncate block"
                        >
                          {resource.link}
                        </a>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {resource.description}
                          </p>
                        )}
                        {/* Tags */}
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {resource.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <EditResourceButton
                        resource={resource}
                        availableTags={tags}
                      />
                      <DeleteResourceDialog
                        resourceId={resource.id}
                        resourceName={resource.name}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar - Tags Manager */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <TagsManager tags={tags} />
      </div>
    </div>
  );
}
