import { isAdminAuthenticated } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

/**
 * Server component gate: the dashboard tree below is only ever rendered
 * once `isAdminAuthenticated()` has verified the httpOnly session cookie.
 * A logged-out visitor's response never contains the dashboard markup —
 * there is nothing for devtools to reveal or bypass client-side.
 */
export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  return authed ? <AdminDashboard /> : <AdminLogin />;
}
