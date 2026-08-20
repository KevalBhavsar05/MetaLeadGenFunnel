import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
export const adminAuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.adminToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: Admins only" });
    }
    req.user = {
      role: decoded.role,
      username: decoded.username,
    };
    next();
  } catch (error) {
    console.error("Error in adminAuthMiddleware:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
};
