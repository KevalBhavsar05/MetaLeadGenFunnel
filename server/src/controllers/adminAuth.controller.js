import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import md5 from "md5";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Username and password are required" });
    }

    // Retrieve admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = md5(process.env.ADMIN_PASSWORD);
    const hashedPassword = md5(req.body.password);

    if (username === adminUsername && hashedPassword === adminPassword) {
      const token = jwt.sign(
        { username: adminUsername, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "24h" },
      );

      const isProduction = process.env.NODE_ENV === "production";
      return res
        .cookie("adminToken", token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? "None" : undefined,
          partitioned: isProduction,
          path: "/",
        })
        .status(200)
        .json({ success: true, message: "Admin login successful", token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    return res
      .clearCookie("adminToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : undefined,
        partitioned: isProduction,
        path: "/",
      })
      .status(200)
      .json({ success: true, message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Error during admin logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
