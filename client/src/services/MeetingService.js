import api from "./axiosInstance.js";

export const bookMeeting = async (meetingData) => {
  const response = await api.post("/meetings", meetingData);
  return response.data;
};

export const getMeetings = async (type) => {
  const response = await api.get("/meetings");
  return response.data;
};

export const cancelMeeting = async (meetingId, feedback) => {
  const response = await api.post(`/meetings/cancel/${meetingId}`, {
    feedback,
  });
  return response.data;
};
