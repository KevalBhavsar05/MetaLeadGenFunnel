import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar as CalendarIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchSlots } from "@/hooks/useSlots";
import { useBookMeeting } from "@/hooks/useMeeting";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/** Parse slot time string to minutes since midnight (handles "10:00", "10:00 AM", "1:00 PM") */
function parseSlotToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;
  const upper = timeStr.trim().toUpperCase();
  const hasPM = upper.includes("PM");
  const hasAM = upper.includes("AM");
  const parts = timeStr
    .replace(/\s*(AM|PM)/i, "")
    .trim()
    .split(":")
    .map(Number);
  let hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  if (hasPM && hours !== 12) hours += 12;
  if (hasAM && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/** Display slot time in 12h format (idempotent if already "10:00 AM") */
function formatSlotForDisplay(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return "";
  if (/AM|PM/i.test(timeStr)) return timeStr.trim();
  const mins = parseSlotToMinutes(timeStr);
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${ampm}`;
}

const ScheduleModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });
  const { data } = useFetchSlots();
  const meeting = useBookMeeting();
  const queryClient = useQueryClient();

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  /** YYYY-MM-DD in local time (avoids timezone mismatches with API dates) */
  const toLocalDateStr = useCallback((dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  const getSlotsForDate = useCallback(
    (dateObj) => {
      if (!data?.slots) return [];
      const dayOfWeek = dateObj.getDay();
      const dateStr = toLocalDateStr(dateObj);
      const dayConfig = data.slots.find(
        (s) => s.dayOfWeek === dayOfWeek && s.isActive
      );
      if (!dayConfig) return [];
      const bookings = data.bookedMeetings ?? [];
      return dayConfig.slots.filter((slot) => {
        const isBooked = bookings.some((b) => {
          const bDate =
            typeof b.date === "string"
              ? b.date.split("T")[0]
              : b.date?.toISOString?.()?.split("T")[0];
          return (
            bDate === dateStr &&
            String(b.slotTime).trim() === String(slot.time).trim()
          );
        });
        return !isBooked;
      });
    },
    [data?.slots, data?.bookedMeetings, toLocalDateStr]
  );

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return getSlotsForDate(new Date(selectedDate));
  }, [selectedDate, getSlotsForDate]);

  const todayStr = useMemo(() => toLocalDateStr(new Date()), [toLocalDateStr]);

  const slotsAvailableForSelection = useMemo(() => {
    if (!selectedDate) return [];
    if (selectedDate !== todayStr) return slotsForSelectedDate;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    return slotsForSelectedDate.filter(
      (slot) => parseSlotToMinutes(slot.time) > currentMins
    );
  }, [selectedDate, slotsForSelectedDate, todayStr]);

  const noSlotsLeftForToday =
    selectedDate === todayStr &&
    slotsForSelectedDate.length > 0 &&
    slotsAvailableForSelection.length === 0;

  const resetAndClose = useCallback(() => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setSelectedDate(null);
      setSelectedTime(null);
      setUserData({ name: "", email: "", phone: "" });
    }, 300);
  }, [onClose]);

  const handleCreateMeeting = useCallback(() => {
    meeting.mutate(
      { ...userData, date: selectedDate, slotTime: selectedTime },
      {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["slots"] }),
        onError: (err) =>
          toast.error(err?.response?.data?.message || "Error booking meeting"),
      }
    );
    setStep(3);
  }, [userData, selectedDate, selectedTime, meeting, queryClient]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-[95%] sm:w-[90%] max-w-4xl max-h-[90vh] 
                         bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl z-[70] 
                         flex flex-col md:flex-row overflow-hidden"
          >
            {/* Improved Close Button for Touch */}
            <button
              type="button"
              onClick={resetAndClose}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-[80] p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-slate-600" />
            </button>

            {/* Sidebar (becomes Header on Mobile) */}
            <div className="w-full md:w-[240px] bg-slate-50 p-6 md:p-10 border-b md:border-b-0 md:border-r border-slate-100 flex flex-row md:flex-col justify-between items-center md:items-start">
              <div className="flex items-center md:block gap-4">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-0 md:mb-6 shadow-lg shadow-blue-200 shrink-0">
                  <CalendarIcon className="text-white w-5 h-5 md:w-6 md:h-6" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                  {step === 1
                    ? "Your Info"
                    : step === 2
                      ? "Pick a Slot"
                      : "Status"}
                </h2>
              </div>

              {selectedDate && step === 2 && (
                <div className="hidden md:block pt-6 border-t border-slate-200 w-full">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                    Selection
                  </p>
                  <p className="text-sm font-semibold text-slate-700 mt-1">
                    {selectedDate}
                  </p>
                  {selectedTime && (
                    <p className="text-blue-600 font-bold text-sm">
                      {formatSlotForDisplay(selectedTime)}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-12 overflow-y-auto">
              {step === 1 && (
                <motion.form
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep(2);
                  }}
                  className="space-y-4 max-w-md mx-auto"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Full Name
                    </label>
                    <Input
                      required
                      type="text"
                      value={userData.name}
                      onChange={(e) =>
                        setUserData({ ...userData, name: e.target.value })
                      }
                      className="h-12 md:h-14 rounded-xl md:rounded-2xl"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Email
                    </label>
                    <Input
                      required
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                      className="h-12 md:h-14 rounded-xl md:rounded-2xl"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">
                      Phone
                    </label>
                    <Input
                      required
                      type="tel"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                      className="h-12 md:h-14 rounded-xl md:rounded-2xl"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 md:h-14 text-white hover:bg-blue-700 bg-blue-600 rounded-xl md:rounded-2xl font-bold mt-4 shadow-xl shadow-blue-100"
                  >
                    See Available Slots
                  </Button>
                </motion.form>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col lg:flex-row gap-8"
                >
                  {/* Date Grid */}
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">
                      Select a Date
                    </h3>
                    <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 md:gap-3">
                      {availableDates.map((date) => {
                        const dateStr = toLocalDateStr(date);
                        const slots = getSlotsForDate(date);
                        const isSelected = selectedDate === dateStr;
                        const hasSlots = slots.length > 0;

                        return (
                          <button
                            type="button"
                            key={dateStr}
                            disabled={!hasSlots}
                            onClick={() => {
                              setSelectedDate(dateStr);
                              setSelectedTime(null);
                            }}
                            className={`flex flex-col items-center justify-center py-2 px-1 md:p-3 rounded-xl md:rounded-2xl transition-all border-2
                                ${isSelected
                                ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                                : hasSlots
                                  ? "bg-white border-slate-100 text-slate-700 hover:border-blue-200"
                                  : "bg-slate-50 border-transparent text-slate-300 opacity-50 cursor-not-allowed"
                              }
                              `}
                          >
                            <span
                              className={`text-[9px] md:text-[10px] font-bold uppercase ${isSelected ? "text-blue-100" : "opacity-60"
                                }`}
                            >
                              {date.toLocaleString("default", {
                                weekday: "short",
                              })}
                            </span>
                            <span className="text-base md:text-lg font-black">
                              {date.getDate()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Slot list */}
                  <div className="w-full lg:w-64">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">
                      Available Times{" "}
                      {selectedDate && `for ${selectedDate.split("-")[2]}`}
                    </h3>
                    {selectedDate ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                          {slotsAvailableForSelection.map((slot) => (
                            <button
                              key={`${slot.time}-${slot.label ?? ""}`}
                              type="button"
                              onClick={() => setSelectedTime(slot.time)}
                              className={`w-full p-3 md:p-4 rounded-xl border-2 text-xs md:text-sm font-bold transition-all text-center lg:text-left
                                  ${selectedTime === slot.time
                                  ? "border-blue-600 bg-blue-50 text-blue-700"
                                  : "border-slate-50 bg-slate-50 text-slate-500"
                                }`}
                            >
                              {formatSlotForDisplay(slot.time)}
                            </button>
                          ))}
                        </div>

                        {noSlotsLeftForToday && (
                          <p className="text-xs text-rose-500 italic mt-2">
                            No slots left today.
                          </p>
                        )}

                        <Button
                          disabled={!selectedTime}
                          onClick={handleCreateMeeting}
                          className="w-full h-12 bg-slate-800 text-white rounded-xl mt-4"
                        >
                          Confirm Booking
                        </Button>
                      </div>
                    ) : (
                      <div className="h-24 md:h-32 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-center">
                        <p className="text-slate-300 text-xs italic">
                          Select a date first
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <div className="text-center py-6 md:py-10 space-y-6">
                  <div className="text-center py-10 space-y-6">
                    {meeting.isPending && (
                      <div className="flex flex-col items-center space-y-4">
                        <Loader2
                          className="animate-spin text-slate-400"
                          size={40}
                        />
                        <p className="text-slate-500">Booking your meeting...</p>
                      </div>
                    )}
                    {!meeting.isPending && meeting.isError && (
                      <div className="space-y-6">
                        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-red-100">
                          <X size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">
                          Error!
                        </h2>
                        <p className="text-slate-500">
                          There was an issue booking your meeting. Please try
                          again.
                        </p>
                        <Button
                          onClick={resetAndClose}
                          variant="outline"
                          className="px-10 h-12 bg-slate-800 hover:bg-slate-900 cursor-pointer text-white rounded-xl"
                        >
                          Close
                        </Button>
                      </div>
                    )}
                    {!meeting.isPending && !meeting.isError && (
                      <div className="space-y-6">
                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-100">
                          <CheckCircle2 size={40} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">
                          BOOKED!
                        </h2>
                        <p className="text-slate-500">
                          {selectedDate} at {formatSlotForDisplay(selectedTime)}
                        </p>
                        <Button
                          onClick={resetAndClose}
                          variant="outline"
                          className="px-10 h-12 bg-slate-800 hover:bg-slate-900 cursor-pointer text-white rounded-xl"
                        >
                          Close
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

              )}
            </div>
          </motion.div>
        </>
      )
      }
    </AnimatePresence >
  );
};

export default ScheduleModal;
