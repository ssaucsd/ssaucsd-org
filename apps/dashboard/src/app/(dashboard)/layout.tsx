import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-full">
        <header className="fixed top-0 z-10 flex w-full h-14 shrink-0 items-center gap-2 px-4 border-b bg-background">
          <SidebarTrigger className="-ml-1" />
          <DynamicBreadcrumb />
        </header>
        <div className="p-4 pt-16">{children}</div>
      </main>
    </SidebarProvider>
  );
}
