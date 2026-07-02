


import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import Product from "@/src/app/lib/models/Product";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";
import { isMainAdminEmail } from "@/src/app/lib/admin";
import { uploadImages } from "@/src/app/lib/uploadImages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  return error instanceof Error ? error.message : "An unexpected error occurred.";
}

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    await connectDB();

    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("ADMIN_GET_PRODUCTS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error) || "Failed to fetch products.",
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
    const condition = String(
      formData.get("condition") || "verified"
    ).trim();

    const price = Number(formData.get("price") || 0);
    const stock = Number(formData.get("stock") || 0);
    const isActive =
      String(formData.get("isActive") || "true") === "true";

    const files = formData
      .getAll("images")
      .filter((entry) => entry instanceof File && entry.size > 0);

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required.",
        },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          message: "Product description is required.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid product price.",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(stock) || stock < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid stock quantity.",
        },
        { status: 400 }
      );
    }

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload at least one product image.",
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

    const uploadedImageUrls = [];
    const maxSize = 5 * 1024 * 1024;

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: `${file.name} is not a valid image file.`,
          },
          { status: 400 }
        );
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            message: `${file.name} is larger than 5MB.`,
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await uploadImages(buffer, {
        folder: "student-shop-products",
      });

      const imageUrl = uploaded?.secure_url || uploaded?.url;

      if (!imageUrl) {
        throw new Error(`Cloudinary upload failed for ${file.name}.`);
      }

      // Product.images expects string URLs, not objects.
      uploadedImageUrls.push(imageUrl);
    }

    const product = await Product.create({
      name,
      description,
      category,
      condition,
      price,
      stock,
      images: uploadedImageUrls,
      isActive,
      createdBy: admin.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product uploaded successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN_CREATE_PRODUCT_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: getErrorMessage(error) || "Failed to upload product.",
      },
      { status: 500 }
    );
  }
}
