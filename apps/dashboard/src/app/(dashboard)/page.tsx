import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  ArrowRight01Icon,
  Book,
  Link01Icon,
  ArrowUpRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  getFirstName,
  getUpcomingEventsWithRsvp,
  getPinnedResourcesWithTags,
  getUserRsvpEvents,
} from "@/lib/queries";
import { HomeEventCard } from "@/components/HomeEventCard";

export default async function Page() {
  const firstName = await getFirstName();
  const events = await getUpcomingEventsWithRsvp();
  const resources = await getPinnedResourcesWithTags();
  const rsvpEvents = await getUserRsvpEvents();

  return (
    <div className="flex flex-col min-h-screen w-full p-4 gap-8">
      <h1 className="text-4xl font-serif">Welcome to SSA, {firstName}.</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 grid-rows-[auto,1fr]">
        <Card className="col-span-1 lg:col-span-2 w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex-1 justify-between flex items-center">
              Upcoming Events
              <Link
                href="/events"
                className="text-base text-muted-foreground font-sans flex items-center gap-1"
              >
                View All
                <HugeiconsIcon icon={ArrowRight01Icon} width={16} height={16} />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {events && events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="basis-[calc(50%-6px)]">
                  <HomeEventCard event={event} />
                </div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed border-muted/20">
                <div className="bg-background p-3 rounded-full shadow-sm mb-4">
                  <HugeiconsIcon
                    icon={Calendar}
                    width={32}
                    height={32}
                    className="text-muted-foreground/50"
                  />
                </div>
                <h3 className="text-lg font-medium font-serif text-foreground">
                  No Upcoming Events
                </h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  There are no events scheduled at the moment. Check back soon!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-1 w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex-1 justify-between flex items-center">
              Resources
              <Link
                href="/resources"
                className="text-base text-muted-foreground font-sans flex items-center gap-1"
              >
                View All
                <HugeiconsIcon icon={ArrowRight01Icon} width={16} height={16} />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {resources && resources.length > 0 ? (
              resources.map((resource) => (
                <Link
                  key={resource.id}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="group transition-all duration-200 hover:shadow-sm hover:bg-muted/50 cursor-pointer">
                    <CardContent className="p-3 flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200 shrink-0">
                        <HugeiconsIcon icon={Link01Icon} className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-serif leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                            {resource.name}
                          </h3>
                          <HugeiconsIcon
                            icon={ArrowUpRight01Icon}
                            className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="truncate">
                            {new URL(resource.link).hostname.replace(
                              "www.",
                              "",
                            )}
                          </span>
                          {resource.tags && resource.tags.length > 0 && (
                            <>
                              <span>·</span>
                              <div className="flex flex-wrap gap-1">
                                {resource.tags.map((tag) => (
                                  <span
                                    key={tag.id}
                                    className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                                  >
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed border-muted/20">
                <div className="bg-background p-3 rounded-full shadow-sm mb-4">
                  <HugeiconsIcon
                    icon={Book}
                    width={32}
                    height={32}
                    className="text-muted-foreground/50"
                  />
                </div>
                <h3 className="text-lg font-medium font-serif text-foreground">
                  No Pinned Resources
                </h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  Important resources will be pinned here for quick access.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-2xl font-serif flex-1 justify-between flex items-center">
              Your RSVPs
              <Link
                href="/events"
                className="text-base text-muted-foreground font-sans flex items-center gap-1"
              >
                View All Events
                <HugeiconsIcon icon={ArrowRight01Icon} width={16} height={16} />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {rsvpEvents && rsvpEvents.length > 0 ? (
              rsvpEvents.map((event) => (
                <div
                  key={event.id}
                  className="basis-full sm:basis-[calc(50%-6px)] lg:basis-[calc(33.333%-8px)]"
                >
                  <HomeEventCard event={event} />
                </div>
              ))
            ) : (
              <div className="w-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/10 rounded-lg border-2 border-dashed border-muted/20">
                <div className="bg-background p-3 rounded-full shadow-sm mb-4">
                  <HugeiconsIcon
                    icon={Calendar}
                    width={32}
                    height={32}
                    className="text-muted-foreground/50"
                  />
                </div>
                <h3 className="text-lg font-medium font-serif text-foreground">
                  No RSVPs Yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  You haven&apos;t RSVP&apos;d to any events. Check out the
                  upcoming events above!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
