import { oauth2Client } from "../../config/googleConfig.js";

// Google Calendar Integration
export const googleAuth = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent", // REQUIRED
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });
  res.redirect(url);
};
