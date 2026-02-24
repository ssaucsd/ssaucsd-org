import AdminOnly from "@/components/AdminOnly";
import { ResourcesAdminClient } from "./resources-admin-client";

export default function AdminResourcesPage() {
  return (
    <AdminOnly>
      <div className="flex flex-col min-h-screen w-full p-4 md:p-6 lg:p-8 gap-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif">Manage Resources</h1>
          <p className="text-muted-foreground text-lg">
            Add, edit, or remove resources for SSA members
          </p>
        </div>

        <ResourcesAdminClient />
      </div>
    </AdminOnly>
  );
}
