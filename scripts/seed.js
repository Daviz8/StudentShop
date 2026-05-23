import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: String,
    condition: String,
    price: Number,
    stock: Number,
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PropertySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: String,
    condition: String,
    price: Number,
    stock: Number,
    location: String,
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

const Property =
  mongoose.models.Property || mongoose.model("Property", PropertySchema);

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env.local");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany({});
    await Property.deleteMany({});

    await Product.insertMany([
      {
        name: "iPhone 13 Pro",
        description: "Clean UK-used iPhone 13 Pro with strong battery health.",
        category: "Phone",
        condition: "verified",
        price: 620000,
        stock: 4,
        images: [
          "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=1200",
        ],
        isActive: true,
      },
      {
        name: "Samsung Galaxy S22",
        description: "Verified Samsung Galaxy S22 with clean display.",
        category: "Phone",
        condition: "verified",
        price: 430000,
        stock: 6,
        images: [
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200",
        ],
        isActive: true,
      },
      {
        name: "MacBook Pro 2019",
        description: "Neatly used MacBook Pro for students and creatives.",
        category: "Laptop",
        condition: "verified",
        price: 780000,
        stock: 2,
        images: [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200",
        ],
        isActive: true,
      },
    ]);

    await Property.insertMany([
      {
        name: "Student Generator",
        description:
          "Reliable small generator suitable for hostel and student apartment use.",
        category: "Generator",
        condition: "used",
        price: 145000,
        stock: 2,
        location: "Campus Area",
        images: [
          "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200",
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200",
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200",
        ],
        isActive: true,
      },
      {
        name: "Wooden Bed Stand",
        description:
          "Strong wooden bed stand for student room. Suitable for 4x6 mattress.",
        category: "Bed Stand",
        condition: "fairly_used",
        price: 65000,
        stock: 3,
        location: "Off-campus Lodge",
        images: [
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
          "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200",
          "https://images.unsplash.com/photo-1615874694520-474822394e73?w=1200",
        ],
        isActive: true,
      },
      {
        name: "Student Mattress",
        description:
          "Clean mattress suitable for hostel or lodge room. Affordable and neat.",
        category: "Mattress",
        condition: "used",
        price: 45000,
        stock: 4,
        location: "Student Hostel",
        images: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200",
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200",
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200",
        ],
        isActive: true,
      },
      {
        name: "Reading Table and Chair",
        description:
          "Compact reading table with chair for students. Good for hostel use.",
        category: "Furniture",
        condition: "used",
        price: 55000,
        stock: 3,
        location: "Near Campus Gate",
        images: [
          "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200",
          "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",
          "https://images.unsplash.com/photo-1517705008128-361805f42e86?w=1200",
        ],
        isActive: true,
      },
    ]);

    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}
seed();