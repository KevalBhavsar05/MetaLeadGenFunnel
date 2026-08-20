import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

import {
  getGoogleAuthUrl,
  createOAuthClient,
} from "../../config/googleConfig.js";

export const googleAdminLogin = (req, res) => {
  try {
    const url = getGoogleAuthUrl();

    return res.redirect(url);
  } catch (error) {
    console.error("Google login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start Google login",
    });
  }
};

export const googleAdminCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Authorization code missing");
    }

    const client = createOAuthClient();

    const { tokens } = await client.getToken(code);

    client.setCredentials(tokens);

    const { data } = await client.request({
      url: "https://openidconnect.googleapis.com/v1/userinfo",
    });

    const googleEmail = data.email;

    if (googleEmail !== process.env.ADMIN_EMAIL) {
      return res.status(403).send("Unauthorized Google account");
    }

    const updateData = {
      email: googleEmail,
    };

    if (tokens.access_token) {
      updateData.googleAccessToken = tokens.access_token;
    }

    if (tokens.refresh_token) {
      updateData.googleRefreshToken = tokens.refresh_token;
    }

    await User.findOneAndUpdate(
      {
        email: process.env.ADMIN_EMAIL,
      },
      updateData,
      {
        upsert: true,
        returnDocument: true,
      },
    );

    const adminToken = jwt.sign(
      {
        email: googleEmail,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );

    const isProduction = process.env.NODE_ENV === "production";

    return res
      .cookie("adminToken", adminToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : undefined,
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .redirect(`${process.env.FRONTEND_URL}/admin/dashboard?google=success`);
  } catch (error) {
    console.error("Google callback error:", error.response?.data || error);

    return res.status(500).send("Google authentication failed");
  }
};

export const logoutAdmin = (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    return res
      .clearCookie("adminToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        partitioned: isProduction,
        path: "/",
      })
      .status(200)
      .json({
        success: true,
        message: "Admin logged out successfully",
      });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
