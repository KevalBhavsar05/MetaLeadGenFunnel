import React, { useState } from 'react'
import { useFetchMeetings } from '@/hooks/useMeeting';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from "framer-motion";
import {
    LayoutDashboard, Users, DollarSign, BarChart3,
    Settings, Bell, Search, ArrowUpRight,
    ArrowDownRight, CheckCircle2, Clock, MoreHorizontal,
    Calendar, Video, Star, ExternalLink
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import StartMeetingModal from '@/components/common/StartMeetingModal';
import SpinnerLoader from '@/components/common/SpinnerLoader';

function Overview() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState(null);

    function to12HourFormat(time24) {
        let [hours, minutes] = time24.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // convert 0 -> 12
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    const queryClient = useQueryClient();
    const { data, isPending, isError, error } = useFetchMeetings();
    const stats = [
        { label: "Booked Sessions", value: data?.meetingCount, icon: Calendar },
        { label: "Active Partners", value: data?.userCount, icon: Users },
    ];

    const todayMeetings = data?.meetings.filter((meeting => {
        const meetingDate = new Date(meeting.date);
        const today = new Date();
        return meetingDate.toDateString() === today.toDateString();
        // return true;
    }));

    const getMonthName = (monthIndex) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthIndex];
    }
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* WELCOME */}
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">System <span className="text-blue-600">Overview</span></h1>
                        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">Admin Dashboard</p>
                    </div>
                </div>
                <div className='flex justify-end'>
                    <button className='bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-shadow shadow-md shadow-blue-200'
                        onClick={() => window.location.href = import.meta.env.VITE_BACKEND_URL + '/auth/google'}>
                        Google Activation <ExternalLink size={16} className="inline-block ml-2" />
                    </button>
                </div>

                {/* STATS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-6 border border-blue-200 hover:border-blue-300 hover:cursor-pointer transition-all shadow-sm group">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <stat.icon size={20} />
                                    </div>
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-6">
                    {/* MEETING QUEUE */}
                    <Card className="lg:col-span-2 p-0 overflow-hidden border-slate-200 shadow-sm">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                            <h4 className="font-black uppercase tracking-tight text-slate-900">Today's Schedule</h4>
                        </div>
                        {isPending ?
                            (
                                <SpinnerLoader className='w-full h-40' />
                            ) : isError ?
                                (
                                    <div className="p-6 flex justify-center items-center">
                                        <span className="text-sm text-red-500">Error: {error.message}</span>
                                    </div>
                                ) : todayMeetings.length === 0 ?
                                    (
                                        <div className="p-6 flex justify-center items-center">
                                            <span className="text-sm text-slate-400">No meetings scheduled for today.</span>
                                        </div>
                                    ) :
                                    (
                                        <div className="divide-y divide-slate-100">
                                            {todayMeetings.map((m, i) => (
                                                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition group">
                                                    <div className="flex items-center gap-4">
                                                        {/* Date Icon */}
                                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-slate-500">
                                                            <span className="text-[10px] font-black uppercase tracking-tighter leading-none">
                                                                {getMonthName(new Date(m?.date).getMonth()).slice(0, 3)}
                                                            </span>
                                                            <span className="text-lg font-black leading-none mt-1">
                                                                {new Date(m?.date).getDate()}
                                                            </span>
                                                        </div>

                                                        {/* User Info */}
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{m?.userId?.name || "Guest User"}</p>
                                                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                                                                {to12HourFormat(m?.slotTime)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-6">
                                                        {/* Status Badge */}
                                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${m.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                                                            }`}>
                                                            {m.status}
                                                        </span>

                                                        {/* ACTION BUTTON: Launch Modal */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMeeting(m);
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="p-2.5 rounded-xl cursor-pointer bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <Video size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    )
                        }
                    </Card>
                </div>
            </div>
            <StartMeetingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                meetingData={selectedMeeting}
            />
        </div>
    )
}

export default Overview