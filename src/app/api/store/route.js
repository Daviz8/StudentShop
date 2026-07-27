import { NextResponse } from "next/server";
import { connectDB } from "../../lib/db";
import Product from "../../lib/models/Product";
import Property from "../../lib/models/Property";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeProduct(product) {
  return {
    id: `product-${product._id.toString()}`,
    originalId: product._id.toString(),
    itemType: "product",
    name: product.name,
    description: product.description,
    category: product.category || "Gadget",
    condition: "",
    location: "",
    price: product.price,
    stock: product.stock,
    images: product.images || [],
    isActive: product.isActive,
    createdAt: product.createdAt,
  };
}

function serializeProperty(property) {
  return {
    id: `property-${property._id.toString()}`,
    originalId: property._id.toString(),
    itemType: "property",
    name: property.name,
    description: property.description,
    category: property.category || "Property",
    condition: property.condition || "used",
    location: property.location || "",
    price: property.price,
    stock: property.stock,
    images: property.images || [],
    isActive: property.isActive,
    createdAt: property.createdAt,
  };
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const q = String(searchParams.get("q") || "").trim();
    const category = String(searchParams.get("category") || "all")
      .trim()
      .toLowerCase();

    const productQuery = {
      isActive: true,
      stock: { $gt: 0 },
    };

    const propertyQuery = {
      isActive: true,
      stock: { $gt: 0 },
    };

    if (q) {
      const regex = new RegExp(escapeRegex(q), "i");

      productQuery.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
      ];

      propertyQuery.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
        { condition: regex },
        { location: regex },
      ];
    }

    if (category !== "all") {
      if (category === "properties" || category === "property") {
        productQuery._id = null;
      } else {
        propertyQuery._id = null;

        productQuery.category = new RegExp(
          `^${escapeRegex(category)}$`,
          "i"
        );
      }
    }

    const [products, properties] = await Promise.all([
      Product.find(productQuery).sort({ createdAt: -1 }).lean(),
      Property.find(propertyQuery).sort({ createdAt: -1 }).lean(),
    ]);

    const items = [
      ...products.map(serializeProduct),
      ...properties.map(serializeProperty),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      success: true,
      items,
    });
  } catch (error) {
    console.error("STORE_GET_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to load store.",
      },
      { status: 500 }
    );
  }
}
