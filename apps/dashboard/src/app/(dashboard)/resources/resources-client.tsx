"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceGrid } from "@/components/ResourceGrid";
import posthog from "posthog-js";
import { useQuery } from "convex/react";
import { clientApi } from "@/lib/convex/clientApi";
import { DashboardResourcesSkeleton } from "@/components/dashboard-skeletons";
import type { ResourceWithTags, Tag } from "@ssaucsd/database";

export function ResourcesClient() {
  const tags = useQuery(clientApi.resources.getTags) as Tag[] | undefined;
  const resources = useQuery(clientApi.resources.getResourcesWithTags) as
    | ResourceWithTags[]
    | undefined;
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    const source = resources ?? [];
    if (!selectedTagId) return source;

    return source.filter((resource) =>
      resource.tags.some((tag) => tag.id === selectedTagId),
    );
  }, [resources, selectedTagId]);

  if (tags === undefined || resources === undefined) {
    return <DashboardResourcesSkeleton />;
  }

  const handleTagChange = (value: string) => {
    const newTagId = value === "all" ? null : value;
    setSelectedTagId(newTagId);

    // Track resource filter event
    const selectedTag = tags.find((tag) => tag.id === value);
    posthog.capture("resource_filtered", {
      filter_type: value === "all" ? "all" : "tag",
      tag_id: newTagId,
      tag_name: selectedTag?.name || "All",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={selectedTagId || "all"} onValueChange={handleTagChange}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          {tags.map((tag) => (
            <TabsTrigger key={tag.id} value={tag.id}>
              {tag.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ResourceGrid resources={filteredResources} />
    </div>
  );
}
