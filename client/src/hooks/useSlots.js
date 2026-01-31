import { getSlotsForUser, getAllSlotConfigs, updateSlots } from "@/services/SlotService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useFetchSlots = () =>
  useQuery({
    queryKey: ["slots"],
    queryFn: getSlotsForUser,
  });

/** All days including disabled — for SlotConfig admin page */
export const useFetchSlotConfig = () =>
  useQuery({
    queryKey: ["slotConfig"],
    queryFn: getAllSlotConfigs,
  });

export const useUpdateSlots = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSlots,
    onSuccess: (data) => {
      queryClient.setQueryData(["slots"], (prev) =>
        prev ? { ...prev, slots: data.slots } : { slots: data.slots }
      );
      queryClient.setQueryData(["slotConfig"], { slots: data.slots });
    },
  });
};
