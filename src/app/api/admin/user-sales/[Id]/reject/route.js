import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { deleteCloudinaryImages } from "@/src/app/lib/deleteCloudinaryImages";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanId(value) {
  if (!value || typeof value !== "string") return "";

  return decodeURIComponent(value)
    .trim()
    .replace(/^['"]|['"]$/g, "");
}

async function getIdFromRequest(request, context) {
  try {
    const params = context?.params ? await context.params : {};
    const paramId = cleanId(params?.id);

    if (paramId) return paramId;
  } catch {
    // fallback below
  }

  try {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);

    // /api/user-sales/:id
    const userSalesIndex = parts.findIndex((part) => part === "user-sales");

    if (userSalesIndex !== -1 && parts[userSalesIndex + 1]) {
      return cleanId(parts[userSalesIndex + 1]);
    }

    return "";
  } catch {
    return "";
  }
}

export async function PATCH(request, context) {
  try {
    await connectDB();

  
      const id = await getIdFromRequest(request, context);
  
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        console.error("INVALID_USER_SALE_ID:", {
          receivedId: id,
          url: request.url,
        });
  
        return NextResponse.json(
          {
            success: false,
            message: "Invalid sale request ID.",
            receivedId: id || null,
          },
          { status: 400 }
        );
      }

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
      message: "Item rejected, images has been deleted, and record deleted",
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