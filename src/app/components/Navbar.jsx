import NavbarClient from "./NavbarClient";
import { getCurrentUser } from "../lib/getCurrentUser";

export default async function Navbar() {
  const user = await getCurrentUser();

  return <NavbarClient user={user} />;
}
