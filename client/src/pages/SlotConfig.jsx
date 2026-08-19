import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  LayoutGrid,
  Plus,
  Power,
  Save,
  Settings2,
  Trash2,
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useFetchSlotConfig, useUpdateSlots } from "@/hooks/useSlots";
import { toast } from "sonner";

const SlotConfig = () => {
  const { data: fetchedData, isPending } = useFetchSlotConfig();
  const updateSlotsMutation = useUpdateSlots();
  const [config, setConfig] = useState([]);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const getDayName = (dayNum) =>
    [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][dayNum] || "Unknown";

  useEffect(() => {
    if (fetchedData?.slots) setConfig(fetchedData.slots);
  }, [fetchedData]);

  const handleSubmit = () => {
    updateSlotsMutation.mutate(config, {
      onSuccess: () => toast.success("Slots saved successfully"),
      onError: (err) =>
        toast.error(err?.response?.data?.message || "Failed to save slots"),
    });
  };

  const toggleDayActive = (idx) => {
    const newConfig = [...config];
    newConfig[idx].isActive = !newConfig[idx].isActive;
    setConfig(newConfig);
  };

  const updateSlotDetails = (slotIdx, field, value) => {
    const newConfig = [...config];
    newConfig[selectedDayIdx].slots[slotIdx][field] = value;
    setConfig(newConfig);
  };

  const addSlot = () => {
    const newConfig = [...config];
    newConfig[selectedDayIdx].slots.push({
      time: "12:00",
      label: "New Session",
    });
    setConfig(newConfig);
  };

  const removeSlot = (slotIdx) => {
    const newConfig = [...config];
    newConfig[selectedDayIdx].slots.splice(slotIdx, 1);
    setConfig(newConfig);
  };

  if (isPending || config.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Settings2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  }

  const currentDay = config[selectedDayIdx];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="mx-auto max-w-7xl space-y-5 p-4 sm:space-y-6 sm:p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white sm:h-11 sm:w-11">
              <LayoutGrid size={21} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">
                Admin Dashboard
              </p>
              <h1 className="truncate text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                Slot Configuration
              </h1>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={updateSlotsMutation.isPending}
            className="h-11 w-full cursor-pointer rounded-lg bg-blue-600 px-5 font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          >
            {updateSlotsMutation.isPending ? (
              <Settings2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {updateSlotsMutation.isPending ? "Saving..." : "Save Config"}
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-12 lg:gap-5">
          <Card className="overflow-hidden rounded-lg border-slate-200 bg-white p-0 shadow-sm lg:col-span-4">
            <p className="px-4 pb-2 pt-4 text-[11px] font-black uppercase tracking-widest text-slate-500">
              Schedule
            </p>
            <div className="flex gap-2 overflow-x-auto px-4 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
              {config.map((day, idx) => {
                const active = selectedDayIdx === idx;
                return (
                  <button
                    key={day._id || day.dayOfWeek}
                    type="button"
                    onClick={() => setSelectedDayIdx(idx)}
                    className={`flex min-w-[132px] shrink-0 cursor-pointer items-center justify-between rounded-lg border px-3 py-3 transition sm:min-w-[150px] lg:min-w-0 lg:shrink ${
                      active
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-transparent bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          day.isActive ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      />
                      <span className="text-sm font-black">
                        {getDayName(day.dayOfWeek)}
                      </span>
                    </div>
                    <ChevronRight size={15} className="hidden opacity-50 lg:block" />
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="rounded-lg border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:col-span-8 lg:p-6">
            <div className="mb-5 flex flex-col justify-between gap-4 md:mb-6 md:flex-row md:items-center">
              <div className="min-w-0">
                <h2 className="truncate text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                  {getDayName(currentDay.dayOfWeek)}
                </h2>
                <span
                  className={`mt-2 inline-block rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                    currentDay.isActive
                      ? "bg-blue-50 text-blue-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {currentDay.isActive ? "Active" : "Disabled"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => toggleDayActive(selectedDayIdx)}
                  className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition sm:flex-none ${
                    currentDay.isActive
                      ? "border border-slate-200 bg-white text-slate-600 hover:bg-red-50 hover:text-red-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  <Power size={15} />
                  {currentDay.isActive ? "Disable" : "Enable"}
                </button>

                <Button
                  onClick={addSlot}
                  disabled={!currentDay.isActive}
                  variant="outline"
                  className="h-11 cursor-pointer rounded-lg border-slate-200 font-black sm:flex-none"
                >
                  <Plus size={16} />
                  Slot
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {currentDay.isActive ? (
                  currentDay.slots.map((slot, slotIdx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={slot._id || slotIdx}
                      className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:bg-white sm:grid-cols-[40px_minmax(120px,180px)_1fr_40px] sm:items-center sm:p-4"
                    >
                      <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:flex">
                        <Clock size={18} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 sm:hidden">
                          Time
                        </label>
                        <Input
                          value={slot.time}
                          onChange={(e) =>
                            updateSlotDetails(slotIdx, "time", e.target.value)
                          }
                          type="text"
                          className="h-11 rounded-lg border-slate-200 bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 sm:hidden">
                          Label
                        </label>
                        <Input
                          value={slot.label}
                          placeholder="Label"
                          onChange={(e) =>
                            updateSlotDetails(slotIdx, "label", e.target.value)
                          }
                          type="text"
                          className="h-11 rounded-lg border-slate-200 bg-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSlot(slotIdx)}
                        className="flex h-10 w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-black text-red-600 transition hover:bg-red-50 sm:w-10 sm:border-transparent sm:bg-transparent sm:text-slate-400 sm:hover:text-red-600"
                        aria-label="Remove slot"
                      >
                        <Trash2 size={16} />
                        <span className="sm:hidden">Remove</span>
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
                    <AlertCircle
                      className="mx-auto mb-3 text-slate-300"
                      size={32}
                    />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Schedule Offline
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SlotConfig;
