
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("AUTH_ME_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        user: null,
        message: "Failed to fetch current user.",
      },
      { status: 500 }
    );
  }
}