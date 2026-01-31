import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function getZoomToken() {
  const res = await axios.post("https://zoom.us/oauth/token", null, {
    params: {
      grant_type: "account_credentials",
      account_id: process.env.ZOOM_ACCOUNT_ID,
    },
    auth: {
      username: process.env.ZOOM_CLIENT_ID,
      password: process.env.ZOOM_CLIENT_SECRET,
    },
  });
  return res.data.access_token;
}

export async function createZoomMeeting(title, startTime) {
  const token = await getZoomToken();

  const res = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      title,
      type: 2,
      start_time: startTime,
      duration: 30,
      timezone: "Asia/Kolkata",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}
