import express from "express";
import { adminAuthMiddleware } from "../middlewares/auth.middleware.js";
import { logoutAdmin } from "../controllers/googleAuth.controller.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admin Auth Route is working");
});
// router.post("/login", login);
router.post("/logout", logoutAdmin);
router.get("/me", adminAuthMiddleware, (req, res) => {
  res.status(200).json({
    user: req.user,
    success: true,
    message: "Admin is authenticated",
  });
});

export default router;
