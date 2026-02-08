import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, Plus, Trash2, Save,
    Settings2, ChevronRight, LayoutGrid, Power, AlertCircle
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useFetchSlotConfig, useFetchSlots, useUpdateSlots } from "@/hooks/useSlots";
import { toast } from "sonner";

const SlotConfig = () => {
    const { data: fetchedData, isPending, isError, error } = useFetchSlotConfig();
    const updateSlotsMutation = useUpdateSlots();
    const [config, setConfig] = useState([]);
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);

    const getDayName = (dayNum) => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return days[dayNum] || "Unknown";
    };

    useEffect(() => {
        if (fetchedData?.slots) {
            setConfig(fetchedData.slots);
        }
    }, [fetchedData]);

    const handleSubmit = () => {
        updateSlotsMutation.mutate(config, {
            onSuccess: () => toast.success("Slots saved successfully"),
            onError: (err) => toast.error(err?.response?.data?.message || "Failed to save slots"),
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
        newConfig[selectedDayIdx].slots.push({ time: "12:00", label: "New Session" });
        setConfig(newConfig);
    };

    const removeSlot = (slotIdx) => {
        const newConfig = [...config];
        newConfig[selectedDayIdx].slots.splice(slotIdx, 1);
        setConfig(newConfig);
    };

    if (isPending || config.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-white">
                <Settings2 className="text-blue-600 animate-spin" size={40} />
            </div>
        );
    }

    const currentDay = config[selectedDayIdx];

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-10 selection:bg-blue-100">
            {/* HEADER - MOBILE OPTIMIZED */}
            <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-24 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <LayoutGrid size={18} className="text-white sm:w-[22px]" />
                        </div>
                        <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tighter">
                            TalkWith<span className="text-blue-600">Kartik</span> Slots
                        </h1>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={updateSlotsMutation.isPending}
                        className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-shadow shadow-md shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {updateSlotsMutation.isPending ? (
                            <Settings2 size={16} className="sm:mr-2 animate-spin" />
                        ) : (
                            <Save size={16} className="sm:mr-2" />
                        )}
                        <span className="hidden sm:inline">
                            {updateSlotsMutation.isPending ? "Saving…" : "Save Config"}
                        </span>
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-6 sm:mt-10">
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 sm:gap-10">

                    {/* LEFT: DAY SELECTOR (Scrollable Row on Mobile, Sidebar on Desktop) */}
                    <div className="lg:col-span-4 overflow-hidden">
                        <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4 ml-1">Schedule</p>
                        <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x no-scrollbar">
                            {config.map((day, idx) => (
                                <button
                                    key={day._id || day.dayOfWeek}
                                    onClick={() => setSelectedDayIdx(idx)}
                                    className={`flex-shrink-0 snap-start flex items-center justify-between px-5 py-4 rounded-2xl border transition-all min-w-[120px] lg:w-full
                                    ${selectedDayIdx === idx
                                            ? "bg-white border-blue-200 shadow-md ring-1 ring-blue-100"
                                            : "bg-white/40 border-transparent text-slate-400"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${day.isActive ? "bg-blue-600" : "bg-slate-300"}`} />
                                        <span className={`font-bold uppercase text-xs sm:text-sm ${selectedDayIdx === idx ? "text-slate-900" : ""}`}>
                                            {getDayName(day.dayOfWeek)}
                                        </span>
                                    </div>
                                    <ChevronRight size={14} className="hidden lg:block opacity-40" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: CONTENT AREA */}
                    <div className="lg:col-span-8">
                        <Card className="rounded-[2rem] sm:rounded-[3rem] border-slate-200 bg-white shadow-xl shadow-slate-200/40 p-5 sm:p-10">

                            {/* ACTION BAR */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sm:mb-10">
                                <div className="space-y-1">
                                    <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter text-slate-900">
                                        {getDayName(currentDay.dayOfWeek)}
                                    </h2>
                                    <span className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${currentDay.isActive ? "bg-blue-50 text-blue-600" : "bg-slate-100 text-slate-400"}`}>
                                        {currentDay.isActive ? "Active" : "Disabled"}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleDayActive(selectedDayIdx)}
                                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 h-11 px-5 rounded-xl font-bold text-[10px] uppercase transition-all
                                        ${currentDay.isActive ? "bg-slate-100 text-slate-600 hover:bg-rose-50" : "bg-blue-600 text-white"}`}
                                    >
                                        <Power size={14} />
                                        {currentDay.isActive ? "Disable" : "Enable"}
                                    </button>

                                    <Button onClick={addSlot} disabled={!currentDay.isActive} variant="outline" className="flex-1 md:flex-none rounded-xl h-11 px-5 font-bold border-slate-200">
                                        <Plus size={16} className="mr-1" /> Slot
                                    </Button>
                                </div>
                            </div>

                            {/* SLOTS GRID - RESPONSIVE STACKING */}
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {currentDay.isActive ? (
                                        currentDay.slots.map((slot, sIdx) => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                key={slot._id || sIdx}
                                                className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-5 bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-[2rem] hover:bg-white hover:border-blue-100 transition-all group"
                                            >
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="bg-blue-100 p-2 rounded-full">
                                                        <Clock size={18} className="text-blue-600" />
                                                    </div>
                                                    <Input
                                                        value={slot.time}
                                                        onChange={(e) => updateSlotDetails(sIdx, "time", e.target.value)}
                                                        type="text"
                                                        className={"rounded-full"}
                                                    />
                                                    <div className="hidden sm:block w-[1px] h-6 bg-slate-200 mx-2" />
                                                    <Input
                                                        value={slot.label}
                                                        placeholder="Label"
                                                        onChange={(e) => updateSlotDetails(sIdx, "label", e.target.value)}
                                                        type={"text"}
                                                        className={"rounded-full"}
                                                    />
                                                </div>

                                                <div className="flex justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                                                    <button onClick={() => removeSlot(sIdx)} className="p-2 cursor-pointer text-slate-300 hover:text-rose-500 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center rounded-[2rem] border-2 border-dashed border-slate-100">
                                            <AlertCircle className="mx-auto text-slate-200 mb-2" size={32} />
                                            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Schedule Offline</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SlotConfig;