import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

const redirectUri = `${process.env.BACKEND_URL || "http://localhost:5000"}/auth/google/callback`;

console.error(`[GoogleConfig] OAuth2 Redirect URI: ${redirectUri}`);

export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  redirectUri
);
