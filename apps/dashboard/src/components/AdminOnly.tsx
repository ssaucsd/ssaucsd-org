import { getIsAdmin } from "@/lib/queries";
import { redirect } from "next/navigation";

interface AdminOnlyProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

/**
 * Server component that blocks non-admin users from accessing wrapped content.
 * Redirects to the fallbackUrl (defaults to home page) if user is not an admin.
 *
 * Usage:
 * ```tsx
 * export default async function AdminPage() {
 *     return (
 *         <AdminOnly>
 *             <YourAdminContent />
 *         </AdminOnly>
 *     );
 * }
 * ```
 */
export default async function AdminOnly({
  children,
  fallbackUrl = "/",
}: AdminOnlyProps) {
  const isAdmin = await getIsAdmin();

  if (!isAdmin) {
    redirect(fallbackUrl);
  }

  return <>{children}</>;
}
