import express from "express";
import { googleAuth } from "../controllers/googleAuth.controller.js";
import { googleCallback } from "../controllers/googleCallback.controller.js";

const router = express.Router();

router.get("/google", googleAuth);
router.get("/google/callback", googleCallback);

export default router;
