import Feedback from "../models/feedback.model.js";

export const createFeedback = async (req, res) => {
  try {
    const { name = "", rating, message } = req.body;

    if (!message || !String(message).trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback message is required",
      });
    }

    const numericRating = Number(rating);
    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const feedback = await Feedback.create({
      name,
      rating: numericRating,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
