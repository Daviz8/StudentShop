import { cookies } from "next/headers";
 import { verifyAppToken } from "./jwt";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("student_shop_token")?.value;

  if (!token) {
    return null;
  }

  const user = verifyAppToken(token);

  if (!user) {
    return null;
  }

  return user;
}
