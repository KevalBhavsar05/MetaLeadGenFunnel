import {
  getGoogleAuthUrl,
  createOAuthClient,
} from "../../config/googleConfig.js";
import User from "../models/user.model.js";

export const googleAuth = (req, res) => {
  const url = getGoogleAuthUrl();
  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send("Authorization code missing");
    }

    const client = createOAuthClient();
    const { tokens } = await client.getToken(code);

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
      { upsert: true, returnDocument: true },
    );

    // const env = process.env.NODE_ENV;
    const redirectUrl = `${process.env.FRONTEND_URL}/admin/dashboard?google=success`;
    // console.log(redirectUrl);

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).send("Google authentication failed");
  }
};
