import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    category: String,
    price: Number,
    stock: Number,

    images: [String],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product ||
  mongoose.model(
    "Product",
    ProductSchema
  );

async function seed() {
  try {
    console.log(
      "Connecting..."
    );

    await mongoose.connect(
      process.env.MONGODB_URI
    );

    console.log(
      "Connected to MongoDB"
    );

    await Product.deleteMany({});

    await Product.insertMany([
      {
        name:"iPhone 13 Pro",

        description:
          "Clean UK-used iPhone 13 Pro with strong battery health.",

        category:"Phone",

        price:620000,

        stock:4,

        images:[
          "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=1200"
        ],

        isActive:true,
      },

      {
        name:"Samsung Galaxy S22",

        description:
          "Verified Samsung Galaxy S22 with clean display.",

        category:"Phone",

        price:430000,

        stock:6,

        images:[
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200"
        ],

        isActive:true,
      },

      {
        name:"MacBook Pro 2019",

        description:
          "Neatly used MacBook Pro for students and creatives.",

        category:"Laptop",

        price:780000,

        stock:2,

        images:[
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200"
        ],

        isActive:true,
      },
    ]);

    console.log(
      "Seed completed successfully"
    );

    process.exit(0);

  } catch (error) {

    console.error(
      "Seed failed:",
      error
    );

    process.exit(1);
  }
}

seed();