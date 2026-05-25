import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const ADMIN_EMAIL = "studentshopng.info@gmail.com";

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    role: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const user = await User.findOneAndUpdate(
      {
        email: ADMIN_EMAIL,
      },
      {
        $set: {
          role: "admin",
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      console.log("No user found with that email yet. Sign up first, then run again.");
      process.exit(0);
    }

    console.log("Admin promoted:", user.email);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
