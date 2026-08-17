import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import Product from "@/src/app/lib/models/Product";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";
import { isMainAdminEmail } from "@/src/app/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCT_CATEGORIES = [
 "Gadget",
  "Phones",
  "Home Appliances",
  "Audio",
  "Laptops",
  "Home Essentials",
  "Accessories",
];

const PRODUCT_CONDITIONS = ["new", "used", "fairly_used"];

async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          message: "You must be signed in.",
        },
        { status: 401 }
      ),
    };
  }

  if (user.role !== "admin" && !isMainAdminEmail(user.email)) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          success: false,
          message: "Admin access only.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    user,
  };
}

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred.";
}

export async function PATCH(request, context) {
  try {
    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    await connectDB();

    const params = await context.params;
    const id = params?.id || params?._id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const update = {};

    if (body.name !== undefined) {
      update.name = String(body.name).trim();
    }

    if (body.description !== undefined) {
      update.description = String(body.description).trim();
    }

    if (body.category !== undefined) {
      const category = String(body.category || "").trim();

      if (!PRODUCT_CATEGORIES.includes(category)) {
        return NextResponse.json(
          {
            success: false,
            message: `Category must be one of: ${PRODUCT_CATEGORIES.join(
              ", "
            )}.`,
          },
          { status: 400 }
        );
      }

      update.category = category;
    }

    if (body.condition !== undefined) {
      const condition = String(body.condition || "")
        .trim()
        .toLowerCase();

      if (!PRODUCT_CONDITIONS.includes(condition)) {
        return NextResponse.json(
          {
            success: false,
            message: `Condition must be one of: ${PRODUCT_CONDITIONS.join(
              ", "
            )}.`,
          },
          { status: 400 }
        );
      }

      update.condition = condition;
    }

    if (body.price !== undefined) {
      const price = Number(body.price);

      if (!Number.isFinite(price) || price <= 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Enter a valid product price.",
          },
          { status: 400 }
        );
      }

      update.price = price;
    }

    if (body.stock !== undefined) {
      const stock = Number(body.stock);

      if (!Number.isInteger(stock) || stock < 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Enter a valid stock quantity.",
          },
          { status: 400 }
        );
      }

      update.stock = stock;
    }

    if (body.isActive !== undefined) {
      update.isActive = Boolean(body.isActive);
    }

    const product = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("ADMIN_UPDATE_PRODUCT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error) || "Failed to update product.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    await connectDB();

    const params = await context.params;
    const id = params?.id || params?._id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product ID.",
        },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN_DELETE_PRODUCT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error) || "Failed to delete product.",
      },
      { status: 500 }
    );
  }
}