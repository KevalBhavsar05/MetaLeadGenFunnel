export const meetingReminderMailBody = (name, date, slotTime, meetingLink) => {
  return `
    <html>
        <body>
            <p>Dear ${name},</p>
            <p>This is a reminder for your upcoming meeting scheduled on <strong>${date}</strong> at <strong>${slotTime}</strong>.</p>
            <p>You can join the meeting using the following link:</p>
            <p><a href="${meetingLink}">${meetingLink}</a></p>
            <p>We look forward to your participation.</p>
            <br/>
            <p>Best regards,<br/>The Team</p>   
        </body>
    </html>
  `;
};
