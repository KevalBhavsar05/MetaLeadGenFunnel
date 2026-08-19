import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, Mail, User, Video, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const StartMeetingModal = ({ isOpen, onClose, meetingData }) => {
  if (!isOpen || !meetingData) return null;

  function to12HourFormat(time24) {
    if (!time24) return "";
    let [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 12 }}
          className="relative w-full max-w-lg overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
        >
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Video size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-slate-950">
                  Launch Session
                </h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  TalkWithKartik
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-5 p-5">
            <div className="flex items-center gap-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-lg font-black text-blue-600">
                {meetingData?.userId?.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-slate-950">
                  {meetingData?.userId?.name || "Guest User"}
                </h4>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <Mail size={12} />
                  <span className="truncate">{meetingData?.userId?.email}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                  <User size={12} />
                  <span>{meetingData?.userId?.phone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="rounded-lg border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Date
                  </span>
                </div>
                <p className="text-sm font-black text-slate-950">
                  {new Date(meetingData.date).toLocaleDateString()}
                </p>
              </Card>
              <Card className="rounded-lg border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Time
                  </span>
                </div>
                <p className="text-sm font-black text-slate-950">
                  {to12HourFormat(meetingData.slotTime)}
                </p>
              </Card>
            </div>

            <a
              href={meetingData.meetingStartLink || "https://zoom.us/j/your-link"}
              target="_blank"
              rel="noreferrer"
              className="block"
            >
              <Button className="h-12 w-full cursor-pointer rounded-lg bg-blue-600 font-black text-white hover:bg-blue-700">
                Start Meeting Now
                <ExternalLink size={17} />
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StartMeetingModal;
