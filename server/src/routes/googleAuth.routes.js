import express from "express";
import {
  googleAuth,
  googleCallback,
} from "../controllers/googleAuth.controller.js";
const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
