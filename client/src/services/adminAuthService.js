import api from "./axiosInstance";

export const login = async (credentials) => {
  try {
    const response = await api.post("/adminAuth/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Error in admin login service:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/adminAuth/logout");
    return response.data;
  } catch (error) {
    console.error("Error in admin logout service:", error);
    throw error;
  }
};

export const isMe = async () => {
  try {
    const response = await api.get("/adminAuth/me");
    return response.data.user;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return null; // Not authenticated
    } else {
      console.error("Error in isMe service:", error);
      throw error;
    }
  }
};
