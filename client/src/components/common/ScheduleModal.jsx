import React, { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { useBookMeeting } from "@/hooks/useMeeting";
import { useFetchSlots } from "@/hooks/useSlots";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

const steps = ["Your Info", "Pick a Slot", "Confirmed"];

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">
      {label}
    </label>
    {children}
  </div>
);

const StepBadge = ({ index, activeStep }) => {
  const stepNumber = index + 1;
  const isDone = activeStep > stepNumber;
  const isActive = activeStep === stepNumber;

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-black transition ${
          isDone
            ? "border-blue-600 bg-blue-600 text-white"
            : isActive
              ? "border-blue-600 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-white text-slate-400"
        }`}
      >
        {isDone ? <CheckCircle2 size={15} /> : stepNumber}
      </span>
      <span
        className={`hidden truncate text-[11px] font-black uppercase tracking-widest sm:inline ${
          isActive ? "text-slate-950" : isDone ? "text-blue-600" : "text-slate-400"
        }`}
      >
        {steps[index]}
      </span>
    </div>
  );
};

const EmptyState = ({ children }) => (
  <div className="flex min-h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
    <p className="text-sm text-slate-400">{children}</p>
  </div>
);

const ScheduleModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [userData, setUserData] = useState({ name: "", email: "", phone: "" });

  const { data, isLoading } = useFetchSlots();
  const meeting = useBookMeeting();
  const queryClient = useQueryClient();

  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i += 1) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

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
        (s) => s.dayOfWeek === dayOfWeek && s.isActive,
      );
      if (!dayConfig) return [];

      const bookings = data.bookedMeetings ?? [];
      return dayConfig.slots.filter((slot) => {
        const isBooked = bookings.some((b) => {
          const rawDate =
            typeof b?.date === "string"
              ? b.date
              : b?.date?.$date || b?.date?.toISOString?.();
          const bDate = rawDate ? toLocalDateStr(new Date(rawDate)) : null;
          const bTime = parseSlotToMinutes(String(b?.slotTime ?? "").trim());
          const slotTime = parseSlotToMinutes(String(slot.time).trim());
          return bDate === dateStr && bTime === slotTime;
        });
        return !isBooked;
      });
    },
    [data?.slots, data?.bookedMeetings, toLocalDateStr],
  );

  const todayStr = useMemo(() => toLocalDateStr(new Date()), [toLocalDateStr]);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return getSlotsForDate(new Date(selectedDate));
  }, [selectedDate, getSlotsForDate]);

  const hasAvailableSlots = useCallback(
    (dateObj) => {
      const slots = getSlotsForDate(dateObj);
      if (slots.length === 0) return false;
      const dateStr = toLocalDateStr(dateObj);
      if (dateStr !== todayStr) return true;
      const now = new Date();
      const currentMins = now.getHours() * 60 + now.getMinutes();
      return slots.some((slot) => parseSlotToMinutes(slot.time) > currentMins);
    },
    [getSlotsForDate, toLocalDateStr, todayStr],
  );

  const availableDateOptions = useMemo(
    () => availableDates.filter(hasAvailableSlots).slice(0, 6),
    [availableDates, hasAvailableSlots],
  );

  const slotsAvailableForSelection = useMemo(() => {
    if (!selectedDate) return [];
    if (selectedDate !== todayStr) return slotsForSelectedDate;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    return slotsForSelectedDate.filter(
      (slot) => parseSlotToMinutes(slot.time) > currentMins,
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
      },
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
            className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-[70] flex max-h-[92vh] w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/20"
          >
            <button
              type="button"
              onClick={resetAndClose}
              className="absolute right-4 top-4 z-[80] flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
              aria-label="Close"
            >
              <X size={17} />
            </button>

            <div className="border-b border-slate-200 bg-slate-50 px-5 py-5 sm:px-6">
              <div className="mb-5 flex items-center gap-3 pr-12">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <CalendarIcon size={19} />
                </span>
                <div>
                  <p className="text-lg font-black tracking-tight text-slate-950">
                    Book a Session
                  </p>
                  <p className="text-xs text-slate-500">
                    Pick your details, date, and time.
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                {steps.map((_, index) => (
                  <React.Fragment key={index}>
                    <StepBadge index={index} activeStep={step} />
                    {index < steps.length - 1 && (
                      <div
                        className={`mx-2 h-px flex-1 ${
                          step > index + 1 ? "bg-blue-600" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      setStep(2);
                    }}
                    className="mx-auto max-w-md space-y-5"
                  >
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-slate-950">
                        Tell us about yourself
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        We will use this to send your confirmation and meeting
                        details.
                      </p>
                    </div>

                    <Field label="Full Name">
                      <Input
                        required
                        type="text"
                        value={userData.name}
                        onChange={(e) =>
                          setUserData({ ...userData, name: e.target.value })
                        }
                        className="h-12 rounded-lg border-slate-200 bg-white focus-visible:ring-blue-500/20"
                        placeholder="Enter your full name"
                      />
                    </Field>

                    <Field label="Email Address">
                      <Input
                        required
                        type="email"
                        value={userData.email}
                        onChange={(e) =>
                          setUserData({ ...userData, email: e.target.value })
                        }
                        className="h-12 rounded-lg border-slate-200 bg-white focus-visible:ring-blue-500/20"
                        placeholder="Enter your email"
                      />
                    </Field>

                    <Field label="Phone Number">
                      <Input
                        required
                        type="tel"
                        value={userData.phone}
                        onChange={(e) =>
                          setUserData({ ...userData, phone: e.target.value })
                        }
                        className="h-12 rounded-lg border-slate-200 bg-white focus-visible:ring-blue-500/20"
                        placeholder="Enter your phone number"
                      />
                    </Field>

                    <Button
                      type="submit"
                      className="h-12 w-full cursor-pointer rounded-lg bg-blue-600 font-black text-white hover:bg-blue-700"
                    >
                      See Available Slots
                      <ArrowRight size={16} />
                    </Button>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    className="space-y-6"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <h3 className="text-2xl font-black tracking-tight text-slate-950">
                          Pick your slot
                        </h3>
                        <p className="mt-2 text-sm text-slate-500">
                          Choose a date and time that works best for you.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="h-10 cursor-pointer rounded-lg border-slate-200 text-slate-600"
                      >
                        <ArrowLeft size={15} />
                        Back
                      </Button>
                    </div>

                    <div>
                      <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-500">
                        Select a date
                      </p>
                      {isLoading ? (
                        <div className="flex min-h-24 items-center justify-center">
                          <Loader2
                            size={24}
                            className="animate-spin text-slate-400"
                          />
                        </div>
                      ) : availableDateOptions.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                          {availableDateOptions.map((date) => {
                            const dateStr = toLocalDateStr(date);
                            const isSelected = selectedDate === dateStr;

                            return (
                              <button
                                key={dateStr}
                                type="button"
                                onClick={() => {
                                  setSelectedDate(dateStr);
                                  setSelectedTime(null);
                                }}
                                className={`rounded-lg border p-3 text-center transition ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                                }`}
                              >
                                <span
                                  className={`block text-[10px] font-black uppercase tracking-widest ${
                                    isSelected ? "text-blue-100" : "text-slate-400"
                                  }`}
                                >
                                  {date.toLocaleString("default", {
                                    weekday: "short",
                                  })}
                                </span>
                                <span className="mt-1 block text-2xl font-black leading-none">
                                  {date.getDate()}
                                </span>
                                <span
                                  className={`mt-1 block text-[10px] font-bold uppercase ${
                                    isSelected ? "text-blue-100" : "text-slate-400"
                                  }`}
                                >
                                  {date.toLocaleString("default", {
                                    month: "short",
                                  })}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <EmptyState>
                          No available slots in the next 30 days.
                        </EmptyState>
                      )}
                    </div>

                    <div>
                      <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-slate-500">
                        {selectedDate
                          ? `Available times for ${selectedDate}`
                          : "Available times"}
                      </p>

                      {!selectedDate ? (
                        <EmptyState>Select a date first.</EmptyState>
                      ) : slotsAvailableForSelection.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                          {slotsAvailableForSelection.map((slot) => {
                            const isSelected = selectedTime === slot.time;
                            return (
                              <button
                                key={`${slot.time}-${slot.label ?? ""}`}
                                type="button"
                                onClick={() => setSelectedTime(slot.time)}
                                className={`rounded-lg border px-4 py-3 text-sm font-black transition ${
                                  isSelected
                                    ? "border-blue-600 bg-blue-50 text-blue-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"
                                }`}
                              >
                                {formatSlotForDisplay(slot.time)}
                              </button>
                            );
                          })}
                        </div>
                      ) : noSlotsLeftForToday ? (
                        <EmptyState>
                          No slots remaining for today. Please pick another
                          date.
                        </EmptyState>
                      ) : (
                        <EmptyState>No slots available for this date.</EmptyState>
                      )}
                    </div>

                    {selectedDate && selectedTime && (
                      <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                            Your selection
                          </p>
                          <p className="mt-1 font-bold text-slate-950">
                            {selectedDate} at{" "}
                            {formatSlotForDisplay(selectedTime)}
                          </p>
                        </div>

                        <ConfirmationDialog
                          trigger={
                            <Button
                              type="button"
                              className="h-11 cursor-pointer rounded-lg bg-blue-600 font-black text-white hover:bg-blue-700"
                            >
                              Confirm Booking
                              <ArrowRight size={15} />
                            </Button>
                          }
                          title="Confirm Booking"
                          description="Please review your details before confirming."
                          content={
                            <div className="space-y-3">
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                  Contact Details
                                </p>
                                <p className="mt-2 font-bold text-slate-950">
                                  {userData.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {userData.email}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {userData.phone}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg border border-slate-200 bg-white p-4">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Date
                                  </p>
                                  <p className="mt-2 font-bold text-slate-950">
                                    {selectedDate}
                                  </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-white p-4">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Time
                                  </p>
                                  <p className="mt-2 font-bold text-slate-950">
                                    {formatSlotForDisplay(selectedTime)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          }
                          confirmText="Confirm"
                          cancelText="Edit Details"
                          onConfirm={handleCreateMeeting}
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mx-auto flex max-w-md flex-col items-center py-8 text-center"
                  >
                    {meeting.isPending && (
                      <>
                        <Loader2
                          size={44}
                          className="animate-spin text-slate-400"
                        />
                        <p className="mt-5 text-sm text-slate-500">
                          Booking your meeting...
                        </p>
                      </>
                    )}

                    {!meeting.isPending && meeting.isError && (
                      <>
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
                          <X size={36} />
                        </div>
                        <h2 className="mt-5 text-3xl font-black text-slate-950">
                          Something went wrong
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-slate-500">
                          {meeting.error?.response?.data?.message ||
                            "Failed to book meeting. Please try again."}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="mt-6 h-11 cursor-pointer rounded-lg border-slate-200 text-slate-600"
                        >
                          <ArrowLeft size={15} />
                          Try Again
                        </Button>
                      </>
                    )}

                    {!meeting.isPending && !meeting.isError && (
                      <>
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                          <CheckCircle2 size={40} />
                        </div>
                        <h2 className="mt-5 text-3xl font-black text-slate-950">
                          You're booked!
                        </h2>
                        <p className="mt-2 text-base font-bold text-blue-600">
                          {selectedDate} at {formatSlotForDisplay(selectedTime)}
                        </p>
                        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <p className="text-sm leading-6 text-slate-600">
                            A confirmation has been sent to{" "}
                            <span className="font-bold text-slate-950">
                              {userData.email}
                            </span>
                            . Open it to add this appointment to your calendar.
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetAndClose}
                          className="mt-6 h-11 cursor-pointer rounded-lg border-slate-200 text-slate-600"
                        >
                          Back to Home
                        </Button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ScheduleModal;
