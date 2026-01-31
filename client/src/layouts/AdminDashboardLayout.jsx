import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    BookText,
    Menu,
    X,
    User,
    LogOut,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import SpinnerLoader from "@/components/common/SpinnerLoader";
import { toast } from "sonner";
import { useLogout } from "@/hooks/useAuth";
import { useApp } from "@/contexts/AppContext";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

const AdminDashboardLayout = () => {
    const navigate = useNavigate();
    // const { user, isAuthLoading } = useApp();
    const queryClient = useQueryClient();

    const menuItems = [
        {
            id: "Tab1",
            label: "Tab1",
            icon: LayoutDashboard,
            path: "/tab1",
        },
        {
            id: "Tab2",
            label: "Tab2",
            icon: BookText,
            path: "/tab2",
        },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const logout = useLogout();
    const handleLogout = async () => {
        logout.mutate(undefined, {
            onSuccess: async (response) => {
                if (response?.success) {
                    queryClient.setQueryData(["me"], null);
                    toast.success(response?.message || "Logout successful");
                    navigate("/", { replace: true });
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

    // if (isAuthLoading || logoutMutation.isPending) {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center">
    //             <SpinnerLoader />
    //         </div>
    //     );
    // }

    return (
        <>
            <div className="flex w-full overflow-x-hidden">
                {/* Mobile menu toggle */}
                <div className={`sm:hidden ${isMobileMenuOpen ? "bg-black/80" : "bg-blue-950"} w-full z-50 shadow py-3 px-4 fixed top-0 left-0 flex justify-between items-center`}>
                    <h1 className="text-white font-semibold text-lg truncate">
                        Student Portal
                    </h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 bg-red-700 text-white rounded-md transition-all"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Overlay */}
                {isMobileMenuOpen && (
                    <div
                        className="sm:hidden fixed inset-0 bg-black/50 z-40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <nav
                    className={`bg-blue-950 text-white shadow-lg
            sm:fixed sm:left-0 sm:top-0 sm:h-full sm:w-64 sm:flex sm:flex-col
            fixed top-0 left-0 h-full w-72 max-w-[85%] z-50
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "sm:translate-x-0 -translate-x-full"}
          `}
                >
                    {/* Logo */}
                    <div className="p-5 border-b border-gray-700 text-center">
                        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    </div>

                    {/* Nav Items */}
                    <div
                        className="flex-1 p-4 overflow-y-auto scrollbar-none"
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        <ul className="space-y-2">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <li key={item.id}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                                    ? "bg-white text-black"
                                                    : "hover:bg-white/10 text-white"
                                                }`
                                            }
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            end={item.path === "/"}
                                        >
                                            <Icon className="w-5 h-5 shrink-0" />
                                            <span className="truncate">{item.label}</span>
                                        </NavLink>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Footer */}
                    <div className="p-5 border-t border-gray-700">
                        <div
                            className="flex items-center gap-3 p-3 bg-white text-black rounded-lg cursor-pointer mb-4 shadow-md hover:shadow-lg transition-all"
                            onClick={() => {
                                setIsMobileMenuOpen(false);
                                navigate("/student/profile");
                            }}
                        >
                            <User className="w-6 h-6 shrink-0" />
                            <div className="truncate">
                                <p className="text-xs truncate">Email</p>
                                {/* {user?.email || ""} */}
                            </div>
                        </div>

                        <ConfirmationDialog
                            trigger={
                                <button className="w-full cursor-pointer flex items-center justify-center gap-2 py-3 px-4 bg-red-700 hover:bg-red-800 text-white font-medium rounded-lg transition-all">
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            }
                            title="Logout?"
                            description="Are you sure you want to log out?"
                            confirmText="Logout"
                            cancelText="Cancel"
                            onConfirm={handleLogout}
                        />
                    </div>
                </nav>

                {/* Main Content */}
                <div className="flex-1 min-h-screen px-3 sm:px-6 py-6 mt-16 sm:mt-0 sm:ml-64 bg-gray-50 overflow-x-hidden">
                    <Outlet />
                </div>
            </div>

            {/* Hide Scrollbar */}
            <style>{`
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </>
    );
};

export default AdminDashboardLayout;
