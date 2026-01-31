import User from "../models/user.model.js";
import Meeting from "../models/meetings.models.js";
import { createZoomMeeting } from "../services/zoom.service.js";
// import { google } from "googleapis";
// import { oauth2Client } from "../../config/googleConfig.js";
import dotenv from "dotenv";
import { createGoogleMeet } from "../services/googleMeet.service.js";
import transporter from "../../config/nodemailer.js";
import { meetingReminderMailBody } from "../utils/mailBody.js";
dotenv.config();

export const createMeetingWithZoom = async (req, res) => {
  try {
    const { name, email, phone, slotTime, date } = req.body;
    const existingUser = await User.findOne({ email });
    let userId;
    if (existingUser) {
      userId = existingUser._id;
    } else {
      const newUser = await User.create({ name, email, phone });
      userId = newUser._id;
    }
    const existingMeeting = await Meeting.findOne({ slotTime, date });
    if (existingMeeting) {
      return res
        .status(400)
        .json({ success: false, message: "Slot already booked" });
    }
    const meetingTitle = `Meeting with ${name}`;
    const meetingDateTime = `${date}T${slotTime}:00+05:30`;
    const meetingLink = await createZoomMeeting(meetingTitle, meetingDateTime);
    const newMeeting = await Meeting.create({
      userId,
      slotTime,
      date,
      meetingLink: meetingLink.join_url,
      meetingStartLink: meetingLink.start_url,
    });
    return res.status(201).json({ success: true, meeting: newMeeting });
  } catch (error) {
    console.error("Error creating meeting:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().populate("userId");
    const userCount = await User.countDocuments();
    return res.status(200).json({
      success: true,
      meetings,
      meetingCount: meetings.length,
      userCount,
    });
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createMeetingWithGoogleMeet = async (req, res) => {
  try {
    const { name, email, phone, date, slotTime } = req.body;

    if (!email || !date || !slotTime) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // 1️⃣ Find or create attendee
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, phone });
    }

    // 2️⃣ Prevent double booking
    const exists = await Meeting.findOne({
      date: new Date(date),
      slotTime,
      status: { $ne: "cancelled" },
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Slot already booked",
      });
    }

    // 3️⃣ Build datetime (IST)
    const startTimeISO = `${date}T${slotTime}:00+05:30`;
    const endTime = new Date(startTimeISO);
    endTime.setMinutes(endTime.getMinutes() + 30);

    // 4️⃣ Create Google Meet
    const { meetLink, startLink } = await createGoogleMeet({
      summary: `Consultation`,
      description: "Meeting scheduled",
      startTime: startTimeISO,
      endTime: endTime.toISOString(),
      attendeeEmail: email,
    });

    // 5️⃣ Save meeting
    const meeting = await Meeting.create({
      userId: user._id,
      date: new Date(date),
      slotTime,
      meetingLink: meetLink,
      meetingStartLink: startLink,
    });

    const mail = await transporter.sendMail({
      from: `"Meta LeadGen Funnel" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Meeting Scheduled Successfully",
      html: meetingReminderMailBody(name, date, slotTime, meetLink),
    });

    res.status(201).json({
      success: true,
      meeting,
    });
  } catch (error) {
    console.error("Schedule meeting error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const meetingReminder = async (meeting) => {
  try {
  } catch (error) {
    console.error("Meeting reminder error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
