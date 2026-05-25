import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to view your sale requests.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const userId = String(user.id || "");
    const userEmail = String(user.email || "").trim().toLowerCase();

    const ownershipFilters = [];

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      ownershipFilters.push({
        submittedBy: new mongoose.Types.ObjectId(userId),
      });
    }

    if (userEmail) {
      ownershipFilters.push({
        submittedByEmail: userEmail,
      });

      ownershipFilters.push({
        sellerEmail: userEmail,
      });
    }

    const requests = await UserSale.find({
      $and: [
        {
          $or:
            ownershipFilters.length > 0
              ? ownershipFilters
              : [
                  {
                    _id: null,
                  },
                ],
        },

        /*
          Important:
          Hide rejected requests from user side.
          Admin can still see them from /api/user-sales or admin dashboard.
        */
        {
          status: {
            $ne: "rejected",
          },
        },
      ],
    })
      .sort({
        updatedAt: -1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      requests: JSON.parse(JSON.stringify(requests)),
    });
  } catch (error) {
    console.error("GET_MY_USER_SALES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch your sale requests.",
      },
      { status: 500 }
    );
  }
}