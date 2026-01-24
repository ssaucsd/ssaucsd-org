import AdminOnly from "@/components/AdminOnly";
import { getEvents } from "@/lib/queries";
import { EventsAdminClient } from "./events-admin-client";

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <AdminOnly>
      <div className="flex flex-col min-h-screen w-full p-4 md:p-6 lg:p-8 gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif">Manage Events</h1>
          <p className="text-muted-foreground text-lg">
            Add, edit, or remove events for SSA members
          </p>
        </div>

        <EventsAdminClient events={events || []} />
      </div>
    </AdminOnly>
  );
}
