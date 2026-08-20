import React, { useEffect } from "react";
import { ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { useApp } from "@/contexts/useApp";
import { Button } from "@/components/ui/button";
import SpinnerLoader from "@/components/common/SpinnerLoader";

function AdminLogin() {
  const navigate = useNavigate();

  const {
    user,
    isAuthLoading,
    isAuthError,
  } = useApp();

  useEffect(() => {
    if (!isAuthLoading && !isAuthError && user) {
      navigate("/admin/dashboard", {
        replace: true,
      });
    }
  }, [
    user,
    isAuthLoading,
    isAuthError,
    navigate,
  ]);

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL
      }/api/auth/google`;
  };

  if (isAuthLoading && !user) {
    return (
      <SpinnerLoader className="h-screen" />
    );
  }

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
            TalkWith
            <span className="text-blue-600">
              Kartik
            </span>{" "}
            Admin
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage sessions, slots, and
            schedule operations.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Admin Sign In
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Continue with your authorized Google
                account.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              className="h-12 w-full cursor-pointer rounded-lg bg-blue-600 font-black text-white hover:bg-blue-700"
            >
              Continue with Google
              <ArrowRight size={18} />
            </Button>

            <p className="text-center text-xs text-slate-400">
              Only the authorized admin Google account
              can access this dashboard.
            </p>
          </div>
        </div>

        <p className="mt-7 text-center text-xs text-slate-400">
          © 2026 TalkWithKartik Analytics. All rights
          reserved.
        </p>
      </motion.div>
    </div>
  );
}

export default AdminLogin;