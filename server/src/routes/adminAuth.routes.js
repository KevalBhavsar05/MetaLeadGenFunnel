import express from "express";
import { adminLogin, logout } from "../controllers/adminAuth.controller.js";
import { adminAuthMiddleware } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admin Auth Route is working");
});
router.post("/login", adminLogin);
router.post("/logout", logout);
router.get("/me", adminAuthMiddleware, (req, res) => {
  res.status(200).json({
    user: req.user,
    success: true,
    message: "Admin is authenticated",
  });
});

export default router;
