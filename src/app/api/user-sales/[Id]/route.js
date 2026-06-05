

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";

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

export async function GET(request, context) {
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

    const saleRequest = await UserSale.findById(id).lean();

    if (!saleRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "Sale request not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        saleRequest: JSON.parse(JSON.stringify(saleRequest)),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET_USER_SALE_DETAIL_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to fetch sale request.",
      },
      { status: 500 }
    );
  }
}