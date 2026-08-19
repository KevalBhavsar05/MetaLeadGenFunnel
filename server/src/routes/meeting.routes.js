import express from "express";
import { createZoomMeeting } from "../services/zoom.service.js";
import {
  createMeetingWithZoom,
  getMeetings,
  createMeetingWithGoogleMeet,
  cancelMeeting,
} from "../controllers/meeting.controller.js";
const router = express.Router();

router.post("/", createMeetingWithGoogleMeet);
router.get("/", getMeetings);
router.post("/cancel/:meetingId", cancelMeeting);
export default router;
