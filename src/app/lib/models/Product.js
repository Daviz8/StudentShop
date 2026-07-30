import mongoose from "mongoose";

export const PRODUCT_CATEGORIES = [
  "Gadget",
  "Phones",
  "Powerbanks",
  "Audio",
  "Laptops",
  "Home Essentials",
  "Accessories",
];

export const PRODUCT_CONDITIONS = ["new", "used", "fairly_used"];

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: PRODUCT_CATEGORIES,
      default: "Gadget",
      index: true,
    },

    condition: {
      type: String,
      enum: PRODUCT_CONDITIONS,
      default: "new",
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
