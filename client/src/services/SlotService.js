import api from "./axiosInstance";

export const getSlotsForUser = async () => {
  const response = await api.get("/slots/get-slots");
  return response.data;
};

/** All slot configs (including disabled days) for admin config page */
export const getAllSlotConfigs = async () => {
  const response = await api.get("/slots/config");
  return response.data;
};

export const updateSlots = async (slots) => {
  const response = await api.put("/slots/update-slots", { slots });
  return response.data;
};
