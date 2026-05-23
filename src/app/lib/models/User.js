import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
      authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

       avatar: {
      type: String,
      default: "",
    },

  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);