import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Clock,
  LayoutDashboard,
  LogOut,
  PanelLeft,
  PanelLeftClose,
  TrendingUp,
  X,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLogoutAdmin } from "@/hooks/useAdminAuth";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

const Sidebar = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const logout = useLogoutAdmin();

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "meetings", label: "Meetings", icon: Calendar },
    { id: "users", label: "Users", icon: LayoutDashboard },
    { id: "slots", label: "Slots", icon: Clock },
  ];
  const isIconOnly = isCollapsed && !isMobileOpen;

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    onCloseMobile?.();
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: (response) => {
        if (response?.success) {
          queryClient.setQueryData(["me"], null);
          toast.success(response?.message || "Logout successful");
          navigate("/admin-login", { replace: true });
        } else {
          toast.error(response?.message || "Logout failed");
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || "Something went wrong");
      },
    });
  };

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen max-w-[85vw] shrink-0 flex-col border-r border-slate-200 bg-white shadow-xl shadow-slate-950/5 transition-transform duration-300 ease-out lg:sticky lg:max-w-none lg:translate-x-0 lg:shadow-none ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-[280px]`}
      >
        <div
          className={`relative flex min-h-16 items-center gap-3 border-b border-slate-200 px-4 ${isIconOnly ? "lg:justify-center" : "justify-between"
            }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
              <TrendingUp size={19} />
            </div>
            <AnimatePresence initial={false}>
              {!isIconOnly && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden whitespace-nowrap text-lg font-black tracking-tight text-slate-950"
                >
                  TalkWith<span className="text-blue-600">Kartik</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-lg border border-slate-200 p-2 text-slate-500 lg:hidden"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="absolute -right-4 top-1/2 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 hover:text-blue-600 lg:flex"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                title={isIconOnly ? item.label : undefined}
                onClick={() => handleNavClick(item.id)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm font-black transition ${isIconOnly ? "justify-center" : ""
                  } ${active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-700"
                  }`}
              >
                <Icon className="shrink-0" size={18} />
                {!isIconOnly && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 bg-slate-50 p-3">
          <div
            className={`mb-3 flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 ${isIconOnly ? "justify-center" : ""
              }`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-black text-blue-600">
              AD
            </div>
            {!isIconOnly && (
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-slate-950">
                  Admin
                </p>
              </div>
            )}
          </div>

          <ConfirmationDialog
            trigger={
              <button
                type="button"
                className={`flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-black text-red-600 transition hover:bg-red-50 ${isIconOnly ? "px-2" : ""
                  }`}
              >
                <LogOut size={16} />
                {!isIconOnly && <span>Logout</span>}
              </button>
            }
            title="Logout?"
            description="Are you sure you want to log out?"
            confirmText="Logout"
            cancelText="Cancel"
            onConfirm={handleLogout}
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
