import React, { useState } from 'react';
import { Lock, Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLoginAdmin } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';


function AdminLogin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const login = useLoginAdmin();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const handleSubmit = (e) => {
        e.preventDefault();
        login.mutate({ username: username.trim(), password: password.trim() },
            {
                onSuccess: async (response) => {
                    const res = response;

                    if (!res?.success) {
                        toast.error(res?.message || "Login failed. Please try again.");
                        setUsername("");
                        setPassword("");
                        return;
                    }
                    await queryClient.refetchQueries({ queryKey: ['me'] });

                    toast.success("Login successful!");
                    navigate("/admin/dashboard");
                },
                onError: (error) => {
                    toast.error(error.response?.data?.message || "Login failed. Please try again.");
                    setUsername("");
                    setPassword("");
                }
            }
        );
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full"
            >
                {/* Logo/Brand Area */}
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
                        <Lock className="text-white" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">TalkWithKartik Admin</h1>
                    <p className="text-slate-500 mt-2">Enter your credentials to access the portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            variant='btn'
                            type="submit"
                            className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 text-md rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 group"
                            disabled={login.isPending}
                        >
                            {login.isPending ? "Signing In..." : "Sign In"}
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-slate-400">
                    &copy; 2026 TalkWithKartik Analytics. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}

export default AdminLogin;