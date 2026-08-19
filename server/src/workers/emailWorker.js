import "dotenv/config";
import { Worker } from "bullmq";
import { redisConnection } from "../../config/redis.js";
import { meetingReminderMailBody } from "../utils/mailBody.js";
import { sendMail } from "../services/emailService.js";
import Meeting from "../models/meetings.models.js";
import User from "../models/user.model.js";

const worker = new Worker(
  "emailQueue",

  async (job) => {
    const { meetingId, reminderType } = job.data;
    const meeting = await Meeting.findById(meetingId);

    if (!meeting) {
      throw new Error("Meeting not found");
    }

    if (meeting.status === "cancelled") {
      console.log("Meeting cancelled. Skipping reminder.");
      return;
    }

    const user = await User.findById(meeting.userId);

    if (!user) {
      throw new Error("User not found");
    }

    const mailBody = meetingReminderMailBody(
      user.name,
      meeting.date,
      meeting.slotTime,
      meeting.meetingLink,
      reminderType,
    );

    await sendMail({
      userEmail: user.email,
      subject: `${reminderType} Reminder`,
      mailBody,
    });
  },

  {
    connection: redisConnection,
  },
);

worker.on("ready", () => {
  console.log("✅ BullMQ worker ready");
});

worker.on("failed", (job, error) => {
  console.error(`❌ Reminder job ${job?.id} failed:`, error);
});

worker.on("error", (error) => {
  console.error("❌ Worker error:", error);
});
