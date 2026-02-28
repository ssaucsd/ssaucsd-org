import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const homeCardRows = (count: number) =>
  Array.from({ length: count }).map((_, index) => (
    <div key={index} className="rounded-xl border p-0 overflow-hidden">
      <div className="flex h-full">
        <div className="flex items-center justify-center px-4 py-5 bg-muted/40">
          <div className="space-y-2 text-center">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-7 w-10" />
          </div>
        </div>
        <div className="p-5 space-y-3 flex-1">
          <Skeleton className="h-5 w-4/5" />
          <div className="space-y-2 pt-2 border-t border-border/50">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  ));

const eventsGridCards = (count: number) =>
  Array.from({ length: count }).map((_, index) => (
    <Card key={index} className="overflow-hidden p-0 h-full">
      <div className="relative aspect-3/4 bg-muted/30">
        <Skeleton className="h-full w-full rounded-none" />
        <Skeleton className="absolute top-3 left-3 h-14 w-12 rounded-lg" />
      </div>
      <CardContent className="p-5 space-y-4">
        <Skeleton className="h-6 w-4/5" />
        <div className="space-y-2 pt-2 border-t border-border/50">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardContent>
    </Card>
  ));

const resourcesGridCards = (count: number) =>
  Array.from({ length: count }).map((_, index) => (
    <Card key={index} className="overflow-hidden p-0">
      <div className="h-24 bg-muted/40 p-3 flex items-end">
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <CardContent className="p-5 space-y-3">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-3 w-2/3" />
      </CardContent>
    </Card>
  ));

export function DashboardHomeSkeleton() {
  return (
    <div className="flex flex-col min-h-screen w-full p-4 gap-8">
      <Skeleton className="h-11 w-[320px] max-w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 grid-rows-[auto,1fr]">
        <Card className="col-span-1 lg:col-span-2 w-full">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-5 w-16" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {homeCardRows(4)}
          </CardContent>
        </Card>

        <Card className="col-span-1 w-full">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <Skeleton className="h-8 w-36" />
            <Skeleton className="h-5 w-16" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border p-3 flex items-start gap-3"
              >
                <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {homeCardRows(3)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardEventsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen w-full p-4 md:p-6 lg:p-8 gap-8">
      <div className="space-y-3">
        <Skeleton className="h-11 w-72" />
        <Skeleton className="h-6 w-80 max-w-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsGridCards(6)}
      </div>
    </div>
  );
}

export function DashboardResourcesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-9 w-16 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourcesGridCards(6)}
      </div>
    </div>
  );
}

export function DashboardSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

export function AdminEventsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-28" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventsGridCards(6)}
      </div>
    </div>
  );
}

export function AdminResourcesSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-0 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-3/5" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-1">
                        <Skeleton className="h-5 w-14 rounded-full" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="lg:sticky lg:top-6 lg:self-start">
        <CardHeader className="space-y-3">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-4 w-4/5" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function AdminUsersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-28" />
      </div>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                {Array.from({ length: 7 }).map((_, index) => (
                  <th key={index} className="px-4 py-3">
                    <Skeleton className="h-4 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-44" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-4 w-14" />
                  </td>
                  <td className="px-4 py-3">
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
