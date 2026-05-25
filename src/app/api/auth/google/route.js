import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { connectDB } from "@/src/app/lib/db";
import User from "@/src/app/lib/models/User";
import { signAppToken } from "@/src/app/lib/jwt";
import { getRoleForEmail, normalizeEmail } from "@/src/app/lib/admin";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const credential = body.credential;

    if (!credential) {
      return NextResponse.json(
        {
          success: false,
          message: "Google credential is required",
        },
        { status: 400 }
      );
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Google account",
        },
        { status: 401 }
      );
    }

    const googleId = payload.sub;
    const email = normalizeEmail(payload.email);
    const name = payload.name || "Google User";
    const picture = payload.picture || "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Google account email is missing",
        },
        { status: 400 }
      );
    }

    const role = getRoleForEmail(email);

    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          googleId,
          email,
          name,
          picture,
          role,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    const token = signAppToken({
      id: user._id.toString(),
      googleId: user.googleId,
      email: user.email,
      name: user.name,
      picture: user.picture,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: role === "admin" ? "Admin login successful" : "Login successful",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
    });

    response.cookies.set("student_shop_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("GOOGLE_LOGIN_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Google login failed",
      },
      { status: 500 }
    );
  }
}