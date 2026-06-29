import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/src/app/lib/db";
import Property from "@/src/app/lib/models/Property";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";
import { isMainAdminEmail } from "@/src/app/lib/admin";

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

export async function PATCH(request, context) {
  try {
    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    await connectDB();

    const params = await context.params;
    const id = params?._id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid properties ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const update = {};

    if (body.name !== undefined) update.name = body.name;
    if (body.description !== undefined) update.description = body.description;
    if (body.category !== undefined) update.category = body.category;
    if (body.condition !== undefined) update.condition = body.condition;
    if (body.price !== undefined) update.price = Number(body.price);
    if (body.stock !== undefined) update.stock = Number(body.stock);
    if (body.isActive !== undefined) update.isActive = Boolean(body.isActive);

    const properties = await Property.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!properties) {
      return NextResponse.json(
        {
          success: false,
          message: "properties not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "properties updated successfully.",
      properties,
    });
  } catch (error) {
    console.error("ADMIN_UPDATE_PROPERTIES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update properties.",
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
    const id = params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid properties ID.",
        },
        { status: 400 }
      );
    }

    const properties = await Property.findByIdAndDelete(id);

    if (!properties) {
      return NextResponse.json(
        {
          success: false,
          message: "properties not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "properties deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN_DELETE_PROPERTIES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete properties.",
      },
      { status: 500 }
    );
  }
}
