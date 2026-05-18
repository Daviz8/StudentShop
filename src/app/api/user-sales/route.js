import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import UserSale from "../../lib/models/UserSale";
import { uploadImages } from "../../lib/uploadImages";

export async function GET() {
  try {
    await connectDB();

    const requests = await UserSale.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch sale requests",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();

    const sellerName = formData.get("sellerName");
    const sellerPhone = formData.get("sellerPhone");
    const sellerEmail = formData.get("sellerEmail");
    const gadgetName = formData.get("gadgetName");
    const gadgetDescription = formData.get("gadgetDescription");
    const sellerAskingPrice = formData.get("sellerAskingPrice");
    const condition = formData.get("condition") || "used";

    const files = formData.getAll("images");

    if (!sellerName || !sellerPhone || !gadgetName || !gadgetDescription) {
      return NextResponse.json(
        {
          success: false,
          message: "Seller name, phone, gadget name, and description are required",
        },
        { status: 400 }
      );
    }

    if (!sellerAskingPrice || Number(sellerAskingPrice) <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid asking price is required",
        },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload at least one product image",
        },
        { status: 400 }
      );
    }

    if (files.length > 5) {
      return NextResponse.json(
        {
          success: false,
          message: "You can upload a maximum of 5 images",
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
            message: "Only image files are allowed",
          },
          { status: 400 }
        );
      }

      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        return NextResponse.json(
          {
            success: false,
            message: "Each image must not be larger than 5MB",
          },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await uploadImages(buffer, {
        folder: "gadget-sale-items",
      });

      uploadedImages.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
    }

    const saleRequest = await UserSale.create({
      sellerName,
      sellerPhone,
      sellerEmail,
      gadgetName,
      gadgetDescription,
      sellerAskingPrice: Number(sellerAskingPrice),
      condition,
      images: uploadedImages,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Item submitted successfully",
        saleRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to submit item",
      },
      { status: 500 }
    );
  }
}