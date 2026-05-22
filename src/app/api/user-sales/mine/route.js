import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to view your notifications.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const requests = await UserSale.find({
      submittedBy: user.id,
    })
      .sort({ updatedAt: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      requests: JSON.parse(JSON.stringify(requests)),
    });
  } catch (error) {
    console.error("GET_MY_SELL_REQUESTS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch your requests.",
      },
      { status: 500 }
    );
  }
}
