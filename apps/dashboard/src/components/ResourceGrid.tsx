"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Link01Icon,
  File01Icon,
  ArrowUpRight01Icon,
  PinIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import posthog from "posthog-js";
import type { ResourceWithTags } from "@ssaucsd/database";

interface ResourceGridProps {
  resources: ResourceWithTags[];
}

export function ResourceGrid({ resources }: ResourceGridProps) {
  if (!resources || resources.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-muted p-4">
            <HugeiconsIcon
              icon={File01Icon}
              className="h-8 w-8 text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No resources available</h3>
            <p className="text-muted-foreground">
              Check back soon for helpful resources!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const handleResourceClick = (resource: ResourceWithTags) => {
    // Track resource clicked event
    posthog.capture("resource_clicked", {
      resource_id: resource.id,
      resource_name: resource.name,
      resource_link: resource.link,
      resource_is_pinned: resource.is_pinned,
      resource_tags: resource.tags?.map((t) => t.name) || [],
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <Link
          key={resource.id}
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleResourceClick(resource)}
        >
          <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer p-0">
            {/* Gradient Header */}
            <div
              className={`relative h-24 bg-linear-to-br ${resource.is_pinned ? "from-primary/30 via-primary/20 to-primary/10" : "from-primary/20 via-primary/10 to-primary/5"}`}
            >
              {/* Decorative pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
                <div className="absolute -left-4 -bottom-4 h-20 w-20 rounded-full bg-primary/30 blur-xl" />
              </div>

              {/* Icon */}
              <div className="absolute bottom-3 left-5">
                <div className="rounded-xl bg-background/95 backdrop-blur-sm p-3 shadow-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <HugeiconsIcon
                    icon={resource.is_pinned ? PinIcon : Link01Icon}
                    className={`h-5 w-5 ${resource.is_pinned ? "rotate-45" : ""}`}
                  />
                </div>
              </div>

              {/* Pinned Badge */}
              {resource.is_pinned && (
                <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                  Pinned
                </div>
              )}

              {/* External link indicator */}
              {!resource.is_pinned && (
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="rounded-full bg-background/80 backdrop-blur-sm p-2">
                    <HugeiconsIcon
                      icon={ArrowUpRight01Icon}
                      className="h-4 w-4 text-primary"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <CardContent className="p-5 space-y-3">
              <div className="space-y-2">
                <h3 className="text-lg font-serif leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {resource.name}
                </h3>

                {resource.description && (
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {resource.description}
                  </p>
                )}
              </div>

              {/* Tag Pills */}
              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
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

              <div className="pt-2 border-t border-border/50">
                <span className="text-xs text-muted-foreground truncate block">
                  {new URL(resource.link).hostname.replace("www.", "")}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
