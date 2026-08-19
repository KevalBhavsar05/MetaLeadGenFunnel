import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ExternalLink, Users, Video } from "lucide-react";
import { useFetchMeetings } from "@/hooks/useMeeting";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import StartMeetingModal from "@/components/common/StartMeetingModal";
import SpinnerLoader from "@/components/common/SpinnerLoader";

function Overview() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const { data, isPending, isError, error } = useFetchMeetings();

  function to12HourFormat(time24) {
    if (!time24) return "";
    let [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  const stats = [
    { label: "Booked Sessions", value: data?.meetingCount ?? 0, icon: Calendar },
    { label: "Active Partners", value: data?.userCount ?? 0, icon: Users },
  ];

  const todayMeetings =
    data?.meetings?.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      const today = new Date();
      return meetingDate.toDateString() === today.toDateString();
    }) ?? [];

  const getMonthName = (monthIndex) =>
    [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][monthIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
              System Overview
            </h1>
          </div>
          <Button
            type="button"
            onClick={() =>
              (window.location.href =
                import.meta.env.VITE_BACKEND_URL + "/api/auth/google")
            }
            className="h-11 cursor-pointer rounded-lg bg-blue-600 font-black text-white hover:bg-blue-700"
          >
            Google Activation
            <ExternalLink size={16} />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="rounded-lg border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={21} />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                    {stat.label}
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-slate-950">
                    {stat.value}
                  </h3>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="overflow-hidden rounded-lg border-slate-200 bg-white p-0 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
            <div>
              <h2 className="font-black text-slate-950">Today's Schedule</h2>
              <p className="mt-1 text-xs text-slate-500">
                Meetings scheduled for the current day.
              </p>
            </div>
          </div>

          {isPending ? (
            <SpinnerLoader className="h-40 w-full" />
          ) : isError ? (
            <div className="p-6 text-center text-sm text-red-500">
              Error: {error.message}
            </div>
          ) : todayMeetings.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">
              No meetings scheduled for today.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todayMeetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="flex flex-col gap-4 p-5 transition hover:bg-blue-50/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <span className="text-[10px] font-black uppercase leading-none">
                        {getMonthName(new Date(meeting?.date).getMonth()).slice(
                          0,
                          3,
                        )}
                      </span>
                      <span className="mt-1 text-lg font-black leading-none">
                        {new Date(meeting?.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-slate-950">
                        {meeting?.userId?.name || "Guest User"}
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                        {to12HourFormat(meeting?.slotTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700">
                      {meeting.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMeeting(meeting);
                        setIsModalOpen(true);
                      }}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
                      aria-label="Start meeting"
                    >
                      <Video size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <StartMeetingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        meetingData={selectedMeeting}
      />
    </div>
  );
}

export default Overview;
