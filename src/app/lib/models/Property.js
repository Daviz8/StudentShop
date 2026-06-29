import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "Property",
    },

    condition: {
      type: String,
      enum: ["new", "used", "fairly_used"],
      default: "used",
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    location: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      validate: {
        validator(value) {
          return value.length >= 1 && value.length <= 3;
        },
        message: "Property must have between 1 and 3 images",
      },
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model("Property", PropertySchema);