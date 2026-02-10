import { oauth2Client } from "../../config/googleConfig.js";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
// Callback to handle Google's response
export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Authorization code missing");
    }

    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return res
        .status(400)
        .send("Google already connected. Re-consent required.");
    }

    // 🔐 SAVE ADMIN TOKENS
    let adminUser = await User.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL }, // admin user
      {
        googleRefreshToken: tokens.refresh_token,
        googleAccessToken: tokens.access_token,
      },
      { upsert: true, new: true },
    );

    const env = process.env.NODE_ENV;
    const redirectUrl =
      env === "production"
        ? "https://meta-lead-gen-funnel.vercel.app/admin/dashboard?google=success"
        : "http://localhost:5173/admin/dashboard?google=success";
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).send("Google authentication failed");
  }
};
