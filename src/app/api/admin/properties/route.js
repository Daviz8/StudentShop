import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import Property from "@/src/app/lib/models/Property";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";
import { isMainAdminEmail } from "@/src/app/lib/admin";
import { uploadImages } from "@/src/app/lib/uploadImages";

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

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    await connectDB();

    const properties = await Property.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      properties: JSON.parse(JSON.stringify(properties)),
    });
  } catch (error) {
    console.error("ADMIN_GET_PROPERTIES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch properties.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    await connectDB();

    const formData = await request.formData();

    const name = String(formData.get("name") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const category = String(formData.get("category") || "Gadget").trim();
    const condition = String(formData.get("condition") || "verified").trim();
    const price = Number(formData.get("price") || 0);
    const stock = Number(formData.get("stock") || 0);
    const isActive = String(formData.get("isActive") || "true") === "true";

    const files = formData.getAll("images");

    if (!name || !description || !price || stock < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, description, valid price and stock are required.",
        },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload at least one properties image.",
        },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "You can upload a maximum of 5 images.",
        },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      if (!file || typeof file === "string") continue;

      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Only image files are allowed.",
          },
          { status: 400 }
        );
      }

      const maxSize = 3 * 1024 * 1024;

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            message: "Each image must not be larger than 5MB.",
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await uploadImages(buffer, {
        folder: "student-shop-properties",
      });

      uploadedImages.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
    }

    const properties = await Property.create({
      name,
      description,
      category,
      condition,
      price,
      stock,
      images: uploadedImages,
      isActive,
      createdBy: admin.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Properties uploaded successfully.",
        properties,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN_CREATE_PROPERTIES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to upload properties.",
      },
      { status: 500 }
    );
  }
}