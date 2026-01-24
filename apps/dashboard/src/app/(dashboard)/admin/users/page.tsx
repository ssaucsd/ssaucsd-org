import AdminOnly from "@/components/AdminOnly";
import { getAllProfiles } from "@/lib/queries";
import { UsersAdminClient } from "./users-admin-client";

export default async function AdminUsersPage() {
  const users = await getAllProfiles();

  return (
    <AdminOnly>
      <div className="flex flex-col min-h-screen w-full p-4 md:p-6 lg:p-8 gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif">Manage Users</h1>
          <p className="text-muted-foreground text-lg">
            View and manage SSA member profiles
          </p>
        </div>

        <UsersAdminClient users={users || []} />
      </div>
    </AdminOnly>
  );
}
