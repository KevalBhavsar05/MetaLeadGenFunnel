import { google } from "googleapis";
import User from "../models/user.model.js";
import { oauth2Client } from "../../config/googleConfig.js";

export const createGoogleMeet = async ({
  summary,
  description,
  startTime,
  endTime,
  attendeeEmail,
}) => {
  // 1️⃣ Load ADMIN refresh token
  const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (!admin?.googleRefreshToken) {
    throw new Error("Google Calendar not connected");
  }

  // 2️⃣ Set credentials
  oauth2Client.setCredentials({
    refresh_token: admin.googleRefreshToken,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  // 3️⃣ Create event with Google Meet
  const event = {
    summary,
    description,
    start: {
      dateTime: startTime,
      timeZone: "Asia/Kolkata",
    },
    end: {
      dateTime: endTime,
      timeZone: "Asia/Kolkata",
    },
    attendees: [{ email: attendeeEmail }],
    conferenceData: {
      createRequest: {
        requestId: Date.now().toString(),
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    resource: event,
    conferenceDataVersion: 1,
    sendUpdates: "all",
  });

  return {
    meetLink: response.data.hangoutLink,
    startLink: response.data.htmlLink,
  };
};
