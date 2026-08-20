import express from "express";

import {
  googleAdminLogin,
  googleAdminCallback,
} from "../controllers/googleAuth.controller.js";

const router = express.Router();

router.get("/google", googleAdminLogin);
router.get("/google/callback", googleAdminCallback);

export default router;
