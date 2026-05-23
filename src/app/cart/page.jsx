import { redirect } from "next/navigation";
import { getCurrentUser } from "../lib/getCurrentUser";
import CartClient from "../components/CartClient";

export default async function CartPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return <CartClient />;
}