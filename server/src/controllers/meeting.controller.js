import dotenv from "dotenv";
dotenv.config();
import User from "../models/user.model.js";
import Meeting from "../models/meetings.models.js";
import { createZoomMeeting } from "../services/zoom.service.js";
import { createGoogleMeet } from "../services/googleMeet.service.js";
import axios from "axios";
import {
  adminMeetingBookingMailBody,
  meetingReminderMailBody,
} from "../utils/mailBody.js";
import { emailQueue } from "../queues/emailQueue.js";
import { sendMail } from "../services/emailService.js";

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
      user = await User.create({
        name,
        email,
        phone,
      });
    }

    // Find that user has booked a meeting on the same date for other slot
    const existingMeeting = await Meeting.findOne({
      userId: user._id,
      date: new Date(date),
      status: { $ne: "cancelled" },
    });
    if (existingMeeting) {
      return res.status(409).json({
        success: false,
        message: "You have already booked a meeting on this date",
      });
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

    // 3️⃣ Build datetime (normalize to UTC ISO)
    const startDateTime = new Date(`${date}T${slotTime}:00+05:30`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60 * 1000);

    // 4️⃣ Create Google Meet
    const { meetLink, calendarLink } = await createGoogleMeet({
      summary: "Meeting with Kartik",
      description: "Meeting scheduled through TalkWithKartik",
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      attendeeEmail: email,
    });

    // 5️⃣ Save meeting
    const meeting = await Meeting.create({
      userId: user._id,
      date: new Date(date),
      slotTime,
      meetingLink: meetLink,
      meetingStartLink: calendarLink,
    });

    // 6️⃣ Send confirmation mail
    // Email to user
    const mailBody = meetingReminderMailBody(name, date, slotTime, meetLink);

    // await sendMail({
    //   userEmail: email,
    //   subject: "Meeting Confirmation",
    //   mailBody: mailBody,
    // });

    await emailQueue.add("meeting-confirmation", {
      meetingId: meeting._id.toString(),
      userId: user._id.toString(),
      reminderType: "Meeting Confirmation",
      role: "user",
    });

    // Email to admin
    await emailQueue.add("new-meeting-booking", {
      userName: name,
      userEmail: email,
      userPhone: phone,
      date,
      slotTime,
      meetingLink: meetLink,
      reminderType: "New Meeting Booking",
      role: "admin",
      meetingId: meeting._id.toString(),
    });

    // await sendMail({
    //   userEmail: process.env.ADMIN_EMAIL,
    //   subject: `New Meeting Booked - ${name}`,
    //   mailBody: adminMailBody,
    // });

    const meetingTime = startDateTime.getTime();
    const threeHourDelay = meetingTime - Date.now() - 3 * 60 * 60 * 1000;
    const oneHourDelay = meetingTime - Date.now() - 1 * 60 * 60 * 1000;
    const tenminuteDelay = meetingTime - Date.now() - 10 * 60 * 1000;
    if (threeHourDelay > 0) {
      await emailQueue.add(
        "meeting-reminder",
        {
          meetingId: meeting._id.toString(),
          userId: user._id.toString(),
          reminderType: "Meeting Reminder (3 hours before)",
          role: "user",
        },
        {
          delay: threeHourDelay,
          jobId: `meeting-${meeting._id}-3h`,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }

    if (oneHourDelay > 0) {
      await emailQueue.add(
        "meeting-reminder",
        {
          meetingId: meeting._id.toString(),
          userId: user._id.toString(),
          reminderType: "Meeting Reminder (1 hour before)",
          role: "user",
        },
        {
          delay: oneHourDelay,
          jobId: `meeting-${meeting._id}-1h`,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }

    if (tenminuteDelay > 0) {
      await emailQueue.add(
        "meeting-reminder",
        {
          meetingId: meeting._id.toString(),
          userId: user._id.toString(),
          reminderType: "Meeting Reminder (10 minutes before)",
          role: "user",
        },
        {
          delay: tenminuteDelay,
          jobId: `meeting-${meeting._id}-10m`,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }

    return res.status(201).json({
      success: true,
      meeting,
      message: "Meeting created successfully",
    });
  } catch (error) {
    console.error("Schedule meeting error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const cancelMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const meeting = await Meeting.findById(meetingId).populate("userId");
    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting not found" });
    }
    meeting.status = "cancelled";
    meeting.feedback = req.body.feedback || "";
    await meeting.save();

    // Redis/BullMQ reminders are disabled for now.
    try {
      await removeMeetingMailJobs(meetingId);
    } catch (queueError) {
      console.error("Error removing meeting mail jobs:", queueError);
    }

    return res
      .status(200)
      .json({ success: true, message: "Meeting cancelled" });
  } catch (error) {
    console.error("Error cancelling meeting:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
