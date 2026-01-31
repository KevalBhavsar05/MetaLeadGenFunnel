import { bookMeeting, getMeetings } from "@/services/MeetingService";
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
