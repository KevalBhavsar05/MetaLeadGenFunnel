import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Clock,
  BarChart3,
  PanelLeftClose,
  PanelLeft,
  X,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useLogoutAdmin } from "@/hooks/useAdminAuth";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

/* ==========================================================
   COMPONENT: Sidebar
   - Collapsible on desktop (icons-only when collapsed)
   - Mobile: overlay drawer with backdrop
   ========================================================== */
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
    { id: "slots", label: "Slots", icon: Clock },
  ];

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
        console.error("Logout error:", error);
        toast.error(error?.response?.data?.message || "Something went wrong!");
      },
    });
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel: mobile = drawer 280px; desktop = collapsible w-64 / w-20 */}
      <aside
        className={`
          flex flex-col shrink-0 bg-white border-r border-slate-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)]
          fixed lg:sticky top-0 left-0 z-50 h-screen
          w-[280px] max-w-[85vw] lg:max-w-none
          transform transition-transform duration-300 ease-out lg:transition-[width] duration-200 ease-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >

        {/* Header: logo + collapse (desktop) / close (mobile). When collapsed, stack vertically so they don't overlap. */}
        <div
          className={`border-b border-slate-100 min-h-[73px] flex items-center gap-2
            p-4 lg:p-4
            ${isCollapsed ? "lg:flex-col lg:justify-center lg:py-4 lg:gap-3" : "lg:flex-row lg:justify-between lg:p-6"}
          `}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1 lg:flex-initial">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
              <BarChart3 size={18} className="text-white" />
            </div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-xl font-black text-slate-900 tracking-tighter uppercase whitespace-nowrap overflow-hidden"
                >
                  TalkWith<span className="text-blue-600">Kartik</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            )}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden lg:flex p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <PanelLeft size={20} />
                ) : (
                  <PanelLeftClose size={20} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 lg:px-4 space-y-2 mt-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <SidebarLink
                key={item.id}
                icon={<Icon size={18} />}
                label={item.label}
                active={active}
                collapsed={isCollapsed && !isMobileOpen}
                onClick={() => handleNavClick(item.id)}
              />
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 lg:p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
          <div
            className={`px-4 py-3 flex items-center gap-3 border border-slate-200 rounded-xl bg-white shadow-sm ${
              isCollapsed && !isMobileOpen ? "justify-center px-2" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 shrink-0">
              AD
            </div>
            <AnimatePresence initial={false}>
              {(!isCollapsed || isMobileOpen) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden min-w-0"
                >
                  <p className="text-xs font-bold text-slate-900 truncate">Admin Flow</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Super Admin</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-3">
            <ConfirmationDialog
              trigger={
                <button
                  type="button"
                  className={`w-full flex items-center cursor-pointer justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all border border-slate-200 bg-white text-rose-600 hover:bg-rose-50 ${
                    isCollapsed && !isMobileOpen ? "px-2" : ""
                  }`}
                >
                  <LogOut size={16} />
                  {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
                </button>
              }
              title="Logout?"
              description="Are you sure you want to log out?"
              confirmText="Logout"
              cancelText="Cancel"
              onConfirm={handleLogout}
            />
          </div>
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ icon, label, active = false, collapsed, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 uppercase tracking-tight group
        ${collapsed ? "justify-center px-3" : ""}
        ${active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
          : "text-slate-400 cursor-pointer hover:bg-white hover:text-blue-600 hover:shadow-sm border border-transparent hover:border-slate-100"
        }`}
    >
      <span className={`shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-blue-600"} transition-colors`}>
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
};

export default Sidebar;
