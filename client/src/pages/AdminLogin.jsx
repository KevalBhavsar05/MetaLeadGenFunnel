import React, { useState } from "react";
import { ArrowRight, Lock, Mail, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLoginAdmin } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = useLoginAdmin();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = (e) => {
    e.preventDefault();
    login.mutate(
      { username: username.trim(), password: password.trim() },
      {
        onSuccess: async (response) => {
          if (!response?.success) {
            toast.error(response?.message || "Login failed. Please try again.");
            setUsername("");
            setPassword("");
            return;
          }

          await queryClient.refetchQueries({ queryKey: ["me"] });
          toast.success("Login successful");
          navigate("/admin/dashboard");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Login failed. Please try again.",
          );
          setUsername("");
          setPassword("");
        },
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10 text-slate-950">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <TrendingUp size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            TalkWith<span className="text-blue-600">Kartik</span> Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage sessions, slots, and schedule operations.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                Username
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="h-12 w-full cursor-pointer rounded-lg bg-blue-600 font-black text-white hover:bg-blue-700"
              disabled={login.isPending}
            >
              {login.isPending ? "Signing in..." : "Sign In"}
              <ArrowRight size={18} />
            </Button>
          </form>
        </div>

        <p className="mt-7 text-center text-xs text-slate-400">
          © 2026 TalkWithKartik Analytics. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

export default AdminLogin;
