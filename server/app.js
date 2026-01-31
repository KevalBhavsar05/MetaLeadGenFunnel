import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/config.js";
import slotRoutes from "./src/routes/slot.routes.js";
import meetingRoutes from "./src/routes/meeting.routes.js";
import googleAuthRoutes from "./src/routes/googleAuth.routes.js";
import adminAuthRoutes from "./src/routes/adminAuth.routes.js";
// import "./src/services/cron.service.js";
const app = express();

const allowedOrigins = [
  // "http://localhost:5173",
  process.env.FRONTEND_URL,
  // process.env.FRONTEND_PROD_URL,
];

app.use(
  cors({
    origin: allowedOrigins,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend server is running..");
});

app.use("/api/slots", slotRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/api/adminAuth", adminAuthRoutes);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
