import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  slotTime: {
    type: String,
    required: true,
  },
  meetingLink: {
    type: String,
    required: true,
  },
  meetingStartLink: {
    type: String,
    required: true,
  },
  oneDayReminderSent: {
    type: Boolean,
    default: false,
  },
  oneHourReminderSent: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "confirmed",
  },
  createdAt: { type: Date, default: Date.now },
});

const Meeting = mongoose.model("Meeting", MeetingSchema);

export default Meeting;
