import express from "express";
import { getSlotsForUser, getAllSlotConfigs, seedSlots, updateSlots } from "../controllers/slot.controller.js";
const router = express.Router();

router.get("/seed-slots", seedSlots);
router.get("/get-slots", getSlotsForUser);
router.get("/config", getAllSlotConfigs);
router.put("/update-slots", updateSlots);

export default router;
