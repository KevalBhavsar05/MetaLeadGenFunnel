import axios from "axios";
export const sendMail = async ({ userEmail, subject, mailBody }) => {
  await axios.post(`${process.env.MAILER_SERVICE_URL}`, {
    email: userEmail,
    subject,
    mailBody,
  });
};
