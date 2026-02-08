import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Video, User, Mail, Calendar,
    Clock, ExternalLink, ShieldCheck, Zap
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

/* ==========================================================
   COMPONENT: StartMeetingModal
   ========================================================== */
const StartMeetingModal = ({ isOpen, onClose, meetingData }) => {
    if (!isOpen || !meetingData) return null;
    function to12HourFormat(time24) {
        let [hours, minutes] = time24.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // convert 0 -> 12
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* BACKDROP */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                {/* MODAL CONTENT */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200"
                >
                    {/* HEADER */}
                    <div className="p-8 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <Video size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Launch Session</h3>
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">TalkWithKartik</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 cursor-pointer hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    {/* USER DETAILS BODY */}
                    <div className="p-8 space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                            <div className="w-14 h-14 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-blue-600 text-xl font-black">
                                {meetingData?.userId?.name?.charAt(0) || "U"}
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-slate-900">{meetingData?.userId?.name}</h4>
                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                    <Mail size={12} />
                                    <span>{meetingData?.userId?.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-500 text-xs">
                                    <User size={12} />
                                    <span>{meetingData?.userId?.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="p-4 border-slate-100 bg-slate-50/30 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Calendar size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Date</span>
                                </div>
                                <p className="text-sm font-bold text-slate-900">{new Date(meetingData.date).toLocaleDateString()}</p>
                            </Card>
                            <Card className="p-4 border-slate-100 bg-slate-50/30 flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Clock size={14} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Time</span>
                                </div>
                                <p className="text-sm font-bold text-slate-900">{to12HourFormat(meetingData.slotTime)}</p>
                            </Card>
                        </div>


                    </div>

                    {/* ACTION FOOTER */}
                    <div className="p-8 pt-0 flex flex-col gap-3">
                        <a
                            href={meetingData.meetingStartLink || "https://zoom.us/j/your-link"}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full"
                        >
                            <Button className="w-full h-14 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-tight shadow-xl shadow-blue-500/20 group">
                                Start Meeting Now
                                <ExternalLink size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </Button>
                        </a>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StartMeetingModal;