import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { deleteCloudinaryImages } from "@/src/app/lib/deleteCloudinaryImages";

export async function PATCH(request, { params }) {
  try {
    await connectDB();

    const { id } = await params;

    const saleRequest = await UserSale.findById(id);

    if (!saleRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Sale request not found",
        },
        { status: 404 }
      );
    }

    await deleteCloudinaryImages(saleRequest.images);

    await UserSale.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Item rejected, images deleted from Cloudinary, and record deleted",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to reject item",
      },
      { status: 500 }
    );
  }
}