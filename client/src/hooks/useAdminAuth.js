import { isMe, login, logout } from "@/services/adminAuthService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLoginAdmin = () =>
  useMutation({
    mutationFn: login,
  });
export const useLogoutAdmin = () =>
  useMutation({
    mutationFn: logout,
  });
export const useVerifyAdmin = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: isMe,
  });
