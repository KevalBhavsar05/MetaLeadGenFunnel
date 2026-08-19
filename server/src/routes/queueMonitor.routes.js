import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";
import { adminAuthMiddleware } from "../middlewares/auth.middleware.js";
import { meetingMailQueue } from "../services/meetingMail.queue.js";

const router = express.Router();
const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath("/api/admin/queues");

createBullBoard({
  queues: [new BullMQAdapter(meetingMailQueue)],
  serverAdapter,
});

router.use("/", adminAuthMiddleware, serverAdapter.getRouter());

export default router;
