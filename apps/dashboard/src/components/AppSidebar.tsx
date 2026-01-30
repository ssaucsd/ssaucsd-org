import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Home,
  MusicNoteSquare02Icon,
  Calendar,
  Book,
  Settings01Icon,
  Logout01Icon,
  User,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { getIsAdmin, getUserProfile } from "@/lib/queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarNav } from "./SidebarNav";

export const userActions = [
  {
    label: "Home",
    icon: Home,
    href: "/",
  },
  {
    label: "Events",
    icon: Calendar,
    href: "/events",
  },
  {
    label: "Resources",
    icon: Book,
    href: "/resources",
  },
];

export const adminActions = [
  {
    label: "Edit Users",
    icon: User,
    href: "/admin/users",
  },
  {
    label: "Edit Events",
    icon: Calendar,
    href: "/admin/events",
  },
  {
    label: "Edit Resources",
    icon: Book,
    href: "/admin/resources",
  },
];

export async function AppSidebar() {
  const isAdmin = await getIsAdmin();
  const user = await getUserProfile();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={MusicNoteSquare02Icon} />
          <div className="font-bold text-lg font-serif group-data-[collapsible=icon]:hidden">
            SSA at UCSD
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav
          userActions={userActions}
          adminActions={adminActions}
          isAdmin={isAdmin}
        />
      </SidebarContent>
      <SidebarFooter className="p-2 gap-2">
        <div className="flex w-full items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex-1 min-w-0 outline-none">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                render={<div />}
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {user?.preferred_name?.charAt(0) ||
                      user?.first_name?.charAt(0) ||
                      "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.preferred_name || user?.first_name || "User"}
                  </span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">
                        {user?.preferred_name?.charAt(0) ||
                          user?.first_name?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user?.preferred_name || user?.first_name || "User"}
                      </span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="/settings"
                  className="cursor-pointer flex items-center gap-2 w-full"
                >
                  <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <form
                  action={async () => {
                    "use server";
                    const { createClient } =
                      await import("@/lib/supabase/server");
                    const supabase = await createClient();
                    await supabase.auth.signOut();
                    const { redirect } = await import("next/navigation");
                    redirect("/login");
                  }}
                  className="w-full"
                >
                  <button className="flex w-full items-center gap-2 cursor-pointer text-destructive focus:text-destructive">
                    <HugeiconsIcon icon={Logout01Icon} className="size-4" />
                    Log out
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
