import { NextResponse } from "next/server";
import { connectDB } from "@/src/app/lib/db";
import UserSale from "@/src/app/lib/models/UserSale";
import { uploadImages } from "../../lib/uploadImages";
import { getCurrentUser } from "@/src/app/lib/getCurrentUser";

function clean(value) {
  return String(value || "").trim();
}

export async function GET() {
  try {
    await connectDB();

    const requests = await UserSale.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      requests: JSON.parse(JSON.stringify(requests)),
    });
  } catch (error) {
    console.error("GET_USER_SALES_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to fetch sale requests.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to submit an item.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await request.formData();

    const sellerName = clean(formData.get("sellerName"));
    const sellerPhone = clean(formData.get("sellerPhone"));
    const sellerEmail = clean(formData.get("sellerEmail") || user.email).toLowerCase();
    const cityArea = clean(formData.get("cityArea"));
    const idType = clean(formData.get("idType"));
    const ninNumber = clean(formData.get("ninNumber"));

    const gadgetName = clean(formData.get("gadgetName"));
    const gadgetDescription =
      clean(formData.get("gadgetDescription")) ||
      clean(formData.get("faultsAccessoriesReason"));

    const brandModel = clean(formData.get("brandModel"));
    const colorVariant = clean(formData.get("colorVariant"));
    const serialOrImei = clean(formData.get("serialOrImei"));
    const category = clean(formData.get("category")) || "electronics_gadget";
    const otherCategory = clean(formData.get("otherCategory"));
    const condition = clean(formData.get("condition")) || "good";
    const sellerAskingPrice = Number(formData.get("sellerAskingPrice") || 0);
    const faultsAccessoriesReason =
      clean(formData.get("faultsAccessoriesReason")) || gadgetDescription;
    const additionalNotes = clean(formData.get("additionalNotes"));

    const returnPreference =
      clean(formData.get("returnPreference")) || "cash_payout";
    const desiredItem = clean(formData.get("desiredItem"));
    const topUpAmount = Number(formData.get("topUpAmount") || 0);

    const heardFrom = clean(formData.get("heardFrom"));
    const referralCode = clean(formData.get("referralCode"));
    const referredBy = clean(formData.get("referredBy"));

    const agreedToTermsRaw = formData.get("agreedToTerms");
    const agreedToTerms =
      agreedToTermsRaw === true ||
      agreedToTermsRaw === "true" ||
      agreedToTermsRaw === "on" ||
      agreedToTermsRaw === "1";

    const files = formData.getAll("images");

    if (!sellerName || !sellerPhone || !gadgetName || !gadgetDescription) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Seller name, phone, gadget name, and description are required.",
        },
        { status: 400 }
      );
    }

    if (!cityArea || !idType) {
      return NextResponse.json(
        {
          success: false,
          message: "City/area and ID type are required.",
        },
        { status: 400 }
      );
    }

    if (!sellerAskingPrice || sellerAskingPrice <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid asking price is required.",
        },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        {
          success: false,
          message: "You must agree to the trade-in terms.",
        },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload at least one image.",
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

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await uploadImages(buffer, {
        folder: "student-shop-tradeins",
      });

      uploadedImages.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      });
    }

    const saleRequest = await UserSale.create({
      submittedBy: user.id,
      submittedByEmail: String(user.email || "").toLowerCase(),

      sellerName,
      sellerPhone,
      sellerEmail,
      cityArea,
      idType,
      ninNumber,

      gadgetName,
      gadgetDescription,
      brandModel,
      colorVariant,
      serialOrImei,
      category,
      otherCategory,
      condition,
      sellerAskingPrice,
      faultsAccessoriesReason,
      additionalNotes,

      returnPreference,
      desiredItem,
      topUpAmount,

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
        message: "Item submitted successfully.",
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
