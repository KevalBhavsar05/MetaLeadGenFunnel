import SlotConfig from "../models/slot.model.js"; // Adjust path as needed
import Meeting from "../models/meetings.models.js";

export const seedSlots = async (req, res) => {
  try {
    const workDaySlots = [
      { time: "10:00 AM", label: "Morning Strategy" },
      { time: "01:00 PM", label: "Afternoon Sync" },
      { time: "04:00 PM", label: "Evening Review" },
    ];

    const weekSchedule = [];

    // Loop through Monday (1) to Friday (5)
    for (let day = 1; day <= 5; day++) {
      weekSchedule.push({
        dayOfWeek: day,
        slots: workDaySlots,
        isActive: true,
      });
    }

    // 4. Weekend (Optional: maybe only one slot on Saturday)
    weekSchedule.push({
      dayOfWeek: 6, // Saturday
      slots: [{ time: "11:00 AM", label: "Weekend Catch-up" }],
      isActive: true,
    });

    // 5. Insert into DB
    await SlotConfig.insertMany(weekSchedule);
    console.log("✅ Fixed slots seeded successfully for Mon-Sat!");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding slots:", error);
    process.exit(1);
  }
};

export const getSlotsForUser = async (req, res) => {
  try {
    const bookedMeetings = await Meeting.find({
      date: { $gte: new Date() },
      status: { $in: ["pending", "confirmed"] },
    }).select("date slotTime");
    const slots = await SlotConfig.find({ isActive: true });
    res.json({ slots, bookedMeetings });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/** Returns all slot configs (including disabled days) for admin config page */
export const getAllSlotConfigs = async (req, res) => {
  try {
    const slots = await SlotConfig.find({}).sort({ dayOfWeek: 1 });
    res.json({ slots });
  } catch (error) {
    console.error("Error fetching slot configs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSlots = async (req, res) => {
  try {
    const { slots: slotsPayload } = req.body;
    if (!Array.isArray(slotsPayload) || slotsPayload.length === 0) {
      return res.status(400).json({ message: "Slots array is required" });
    }

    const updates = slotsPayload.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: {
          $set: {
            dayOfWeek: item.dayOfWeek,
            slots: item.slots ?? [],
            isActive: item.isActive ?? true,
          },
        },
      },
    }));

    await SlotConfig.bulkWrite(updates);
    const updated = await SlotConfig.find({}).sort({ dayOfWeek: 1 });
    res.json({ slots: updated, message: "Slots updated successfully" });
  } catch (error) {
    console.error("Error updating slots:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
