import { submitFeedback } from "@/services/FeedbackService";
import { useMutation } from "@tanstack/react-query";

export const useSubmitFeedback = () =>
  useMutation({
    mutationFn: submitFeedback,
  });
