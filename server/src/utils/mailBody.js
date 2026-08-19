export const meetingReminderMailBody = (
  name,
  date,
  slotTime,
  meetingLink,
  type = "reminder",
) => {
  return `
    <html>
      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f7fb;
        font-family: Arial, Helvetica, sans-serif;
        color: #333333;
      ">
        <div style="
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        ">

          <!-- Header -->
          <div style="
            background-color: #2563eb;
            padding: 24px;
            text-align: center;
          ">
            <h1 style="
              margin: 0;
              color: #ffffff;
              font-size: 24px;
            ">
              Meeting Reminder
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 32px;">
            <p style="font-size: 16px; margin-top: 0;">
              Dear <strong>${name}</strong>,
            </p>

            <p style="
              font-size: 15px;
              line-height: 1.6;
              color: #555555;
            ">
              This is a reminder for your upcoming meeting.
            </p>

            <!-- Meeting Details -->
            <div style="
              margin: 24px 0;
              padding: 20px;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
            ">
              <p style="margin: 0 0 10px;">
                <strong>Date:</strong> ${date}
              </p>

              <p style="margin: 0;">
                <strong>Time:</strong> ${slotTime}
              </p>
            </div>

            <p style="
              font-size: 15px;
              line-height: 1.6;
              color: #555555;
            ">
              You can join the meeting using the button below:
            </p>

            <!-- Join Button -->
            <div style="
              text-align: center;
              margin: 28px 0;
            ">
              <a
                href="${meetingLink}"
                style="
                  display: inline-block;
                  padding: 13px 28px;
                  background-color: #2563eb;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 7px;
                  font-size: 15px;
                  font-weight: bold;
                "
              >
                Join Meeting
              </a>
            </div>

            <p style="
              font-size: 13px;
              line-height: 1.5;
              color: #888888;
              word-break: break-all;
            ">
              Meeting Link:<br/>
              <a
                href="${meetingLink}"
                style="color: #2563eb;"
              >
                ${meetingLink}
              </a>
            </p>

            <p style="
              font-size: 15px;
              line-height: 1.6;
              color: #555555;
            ">
              We look forward to your participation.
            </p>

            <p style="
              margin-bottom: 0;
              font-size: 15px;
              line-height: 1.6;
            ">
              Best regards,<br/>
              <strong>The Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="
            padding: 18px;
            text-align: center;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
          ">
            <p style="
              margin: 0;
              font-size: 12px;
              color: #94a3b8;
            ">
              This is an automated meeting reminder. Please do not reply to this email.
            </p>
          </div>

        </div>
      </body>
    </html>
  `;
};
