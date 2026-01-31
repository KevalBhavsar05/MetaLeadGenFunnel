import express from "express";
import { createZoomMeeting } from "../services/zoom.service.js";
import {
  createMeetingWithZoom,
  getMeetings,
  createMeetingWithGoogleMeet,
} from "../controllers/meeting.controller.js";
const router = express.Router();

router.post("/", createMeetingWithGoogleMeet);
router.get("/", getMeetings);
export default router;
