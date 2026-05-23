import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/lib/models/UserSale";
import { uploadBufferToCloudinary } from "@/lib/uploadToCloudinary";

export async function GET() {
  try {
    await connectDB();

    const requests = await UserSale.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error("GET_USER_SALES_ERROR:", error);

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

    const sellerName = String(formData.get("sellerName") || "").trim();
    const sellerPhone = String(formData.get("sellerPhone") || "").trim();
    const sellerEmail = String(formData.get("sellerEmail") || "").trim();
    const cityArea = String(formData.get("cityArea") || "").trim();
    const idType = String(formData.get("idType") || "").trim();

    const gadgetName = String(formData.get("gadgetName") || "").trim();
    const brandModel = String(formData.get("brandModel") || "").trim();
    const colorVariant = String(formData.get("colorVariant") || "").trim();
    const serialOrImei = String(formData.get("serialOrImei") || "").trim();
    const category = String(formData.get("category") || "").trim();
    const otherCategory = String(formData.get("otherCategory") || "").trim();
    const condition = String(formData.get("condition") || "").trim();
    const sellerAskingPrice = String(
      formData.get("sellerAskingPrice") || ""
    ).trim();
    const faultsAccessoriesReason = String(
      formData.get("faultsAccessoriesReason") || ""
    ).trim();
    const additionalNotes = String(formData.get("additionalNotes") || "").trim();

    const returnPreference = String(
      formData.get("returnPreference") || "cash_payout"
    ).trim();
    const desiredItem = String(formData.get("desiredItem") || "").trim();
    const topUpAmount = String(formData.get("topUpAmount") || "").trim();

    const heardFrom = String(formData.get("heardFrom") || "").trim();
    const referralCode = String(formData.get("referralCode") || "").trim();
    const referredBy = String(formData.get("referredBy") || "").trim();

    const agreedToTermsRaw = formData.get("agreedToTerms");
    const agreedToTerms =
      agreedToTermsRaw === true ||
      agreedToTermsRaw === "true" ||
      agreedToTermsRaw === "on" ||
      agreedToTermsRaw === "1";

    const files = formData.getAll("images");

    const missingFields = [];

    if (!sellerName) missingFields.push("Full name");
    if (!sellerPhone) missingFields.push("Phone / WhatsApp");
    if (!cityArea) missingFields.push("City / Area");
    if (!idType) missingFields.push("ID type");

    if (!gadgetName) missingFields.push("Item name");
    if (!category) missingFields.push("Category");
    if (!condition) missingFields.push("Condition");
    if (!sellerAskingPrice) missingFields.push("Asking price");
    if (!faultsAccessoriesReason)
      missingFields.push("Faults / accessories / reason for selling");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const priceNumber = Number(sellerAskingPrice);

    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid asking price.",
        },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        {
          success: false,
          message: "Please agree to the trade-in terms before submitting.",
        },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload at least one item image.",
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

    const allowedConditions = [
      "brand_new",
      "like_new",
      "good",
      "fair",
      "needs_repair",
    ];

    if (!allowedConditions.includes(condition)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid condition: ${condition}`,
        },
        { status: 400 }
      );
    }

    const allowedReturnPreferences = [
      "cash_payout",
      "store_credit",
      "swap",
      "part_payment",
    ];

    if (!allowedReturnPreferences.includes(returnPreference)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid return preference: ${returnPreference}`,
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

      const maxSize = 5 * 1024 * 1024;

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

      const uploaded = await uploadBufferToCloudinary(buffer, {
        folder: "student-shop-tradeins",
      });

      uploadedImages.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No valid image was uploaded.",
        },
        { status: 400 }
      );
    }

    const saleRequest = await UserSale.create({
      sellerName,
      sellerPhone,
      sellerEmail,
      cityArea,
      idType,

      gadgetName,
      gadgetDescription: faultsAccessoriesReason,
      brandModel,
      colorVariant,
      serialOrImei,
      category,
      otherCategory,
      condition,
      sellerAskingPrice: priceNumber,
      faultsAccessoriesReason,
      additionalNotes,

      returnPreference,
      desiredItem,
      topUpAmount: topUpAmount ? Number(topUpAmount) : 0,

      heardFrom,
      referralCode,
      referredBy,

      agreedToTerms,
      images: uploadedImages,

      status: "submitted",
      negotiationCount: 0,
      negotiations: [],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Trade-in request submitted successfully.",
        saleRequest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_USER_SALE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to submit item.",
      },
      { status: 500 }
    );
  }
}
