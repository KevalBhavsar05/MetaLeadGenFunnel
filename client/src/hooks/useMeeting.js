import {
  bookMeeting,
  cancelMeeting,
  getMeetings,
} from "@/services/MeetingService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useBookMeeting = () =>
  useMutation({
    mutationFn: bookMeeting,
  });
export const useFetchMeetings = () =>
  useQuery({
    queryKey: ["meetings"],
    queryFn: getMeetings,
  });

export const useCancelMeeting = () =>
  useMutation({
    mutationFn: async ({ meetingId, feedback }) => {
      return cancelMeeting(meetingId, feedback);
    },
  });
