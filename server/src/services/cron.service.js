import cron from "node-cron";
import Meetings from "../models/meetings.models.js";
cron.schedule("*/5 * * * *", async () => {
  try {
    const meetings = await Meetings.find({
      $or: [{ oneDayReminderSent: false }, { oneHourReminderSent: false }],
    }).populate("userId");

    const now = new Date();
    const mailsToSend = [];
    for (const meeting of meetings) {
      const meetingDateTime = new Date(
        `${meeting.date.toISOString().split("T")[0]}T${meeting.slotTime}:00+05:30`
      );
      console.log(meetingDateTime);

      const timeDiff = meetingDateTime - now;
      const oneDayInMs = 24 * 60 * 60 * 1000;
      const oneHourInMs = 60 * 60 * 1000;
      if (
        timeDiff <= oneDayInMs &&
        timeDiff > oneDayInMs - 5 * 60 * 1000 &&
        !meeting.oneDayReminderSent
      ) {
        mailsToSend.push({
          meeting,
          type: "oneDay",
        });
        meeting.oneDayReminderSent = true;
        await meeting.save();
      } else if (
        timeDiff <= oneHourInMs &&
        timeDiff > oneHourInMs - 5 * 60 * 1000 &&
        !meeting.oneHourReminderSent
      ) {
        mailsToSend.push({
          meeting,
          type: "oneHour",
        });
        meeting.oneHourReminderSent = true;
        await meeting.save();
      }
    }
    await Promise.all(
      mailsToSend.map(async ({ meeting, type }) => {
        const { userId, date, slotTime, meetingLink } = meeting;
        const name = userId.name;
        const email = userId.email;
        const { transporter } = await import("../utils/mailer.js");
        let subject, body;
        if (type === "oneDay") {
          subject = "Meeting Reminder: 1 Day Left";
        } else {
          subject = "Meeting Reminder: 1 Hour Left";
        }
        body = `<html>
        <body>
            <p>Dear ${name},</p>
            <p>This is a reminder for your upcoming meeting scheduled on <strong>${
              date.toISOString().split("T")[0]
            }</strong> at <strong>${slotTime}</strong>.</p>
            <p>You can join the meeting using the following link:</p>
            <p><a href="${meetingLink}">${meetingLink}</a></p>
            <p>We look forward to your participation.</p>
            <br/>
            <p>Best regards,<br/>The Team</p>
        </body>
    </html>`;
        await transporter.sendMail({
          from: `"Meta LeadGen Funnel" <${process.env.SMTP_USER}>`,
          to: email,
          subject,
          html: body,
        });
      })
    );
  } catch (error) {
    console.error("Cron job error:", error);
    return;
  }
});
