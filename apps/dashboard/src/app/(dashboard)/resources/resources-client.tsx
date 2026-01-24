"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceGrid } from "@/components/ResourceGrid";
import { type Tag, type ResourceWithTags } from "@/lib/queries";
import posthog from "posthog-js";

export function ResourcesClient({
  tags,
  resources,
}: {
  tags: Tag[];
  resources: ResourceWithTags[];
}) {
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const filteredResources = useMemo(() => {
    if (!selectedTagId) return resources;

    return resources.filter((resource) =>
      resource.tags.some((tag) => tag.id === selectedTagId),
    );
  }, [resources, selectedTagId]);

  const handleTagChange = (value: string) => {
    const newTagId = value === "all" ? null : value;
    setSelectedTagId(newTagId);

    // Track resource filter event
    const selectedTag = tags.find((t) => t.id === value);
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
