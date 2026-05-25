import { redirect } from "next/navigation";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";
import { isMainAdminEmail } from "@/src/app/lib/admin";

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signup?returnTo=/admin");
  }

  if (user.role !== "admin" && !isMainAdminEmail(user.email)) {
    redirect("/store");
  }

  return children;
}