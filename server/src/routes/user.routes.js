import express from "express";
import { getAllusers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getAllusers);

export default router;