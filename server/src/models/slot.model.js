import mongoose from "mongoose";

const SlotConfigSchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0,
    max: 6,
  }, // 0=Sunday, 1=Monday...
  slots: [
    {
      time: String, // e.g., "10:00 AM"
      label: String, // e.g., "Morning Session"
    },
  ],
  isActive: { type: Boolean, default: true },
});

const SlotConfig = mongoose.model("SlotConfig", SlotConfigSchema);

export default SlotConfig;