import User from "../models/user.model.js";
export const getAllusers = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    }).select("-password"); // Exclude password field

    return res.status(200).json({ success: true, users: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
