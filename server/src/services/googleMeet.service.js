import dotenv from "dotenv";
dotenv.config();
import { google } from "googleapis";
import { createOAuthClient } from "../../config/googleConfig.js";
import User from "../models/user.model.js";

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

  const client = createOAuthClient();
  // 2️⃣ Set credentials
  client.setCredentials({
    refresh_token: admin.googleRefreshToken,
  });

  const calendar = google.calendar({
    version: "v3",
    auth: client,
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
        requestId: crypto.randomUUID(),
        conferenceSolutionKey: {
          type: "hangoutsMeet",
        },
      },
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: event,
  });

  const meetLink = response.data.conferenceData?.entryPoints?.find(
    (entry) => entry.entryPointType === "video",
  )?.uri;

  if (!meetLink) {
    throw new Error("Google Meet link was not generated");
  }

  return {
    eventId: response.data.id,
    meetLink,
    calendarLink: response.data.htmlLink,
  };
};
