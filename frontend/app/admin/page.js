import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import AdminDashboard from "./admin-dashboard";
import { isAdminUser } from "../_lib/admin-auth";
import { LINE_AUTH_COOKIES, readSessionToken } from "../_lib/line-auth";

export const metadata = { title: "จัดการร้านอาหาร", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const cookieStore = await cookies();
  let user = null;
  try {
    user = readSessionToken(cookieStore.get(LINE_AUTH_COOKIES.session)?.value);
  } catch {
    // Missing configuration is handled as unauthorized.
  }

  if (!isAdminUser(user)) redirect("/");
  return <AdminDashboard user={user} />;
}
