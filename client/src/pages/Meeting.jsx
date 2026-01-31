import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    Search, Video, MoreVertical, CheckCircle2,
    Clock, ChevronRight, UserPlus, MessageSquare, ArrowUpDown
} from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useFetchMeetings } from "@/hooks/useMeeting";
import StartMeetingModal from "@/components/common/StartMeetingModal";

const Meeting = () => {
    const { data, isPending, isError, error } = useFetchMeetings();
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedMeeting, setSelectedMeeting] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Helper functions
    const to12HourFormat = (time24) => {
        if (!time24) return "";
        let [hours, minutes] = time24.split(":").map(Number);
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    // Column Definitions
    const columns = useMemo(() => [
        {
            accessorKey: "userId.name",
            header: "Partner Information",
            cell: ({ row }) => {
                const user = row.original.userId;
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-blue-600 border border-slate-200">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{user?.email}</p>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "date",
            header: "Schedule",
            cell: ({ row }) => (
                <div>
                    <p className="text-sm font-bold text-slate-900">{new Date(row.original.date).toLocaleDateString()}</p>
                    <p className="text-xs text-blue-600 font-black uppercase">{to12HourFormat(row.original.slotTime)}</p>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
                const status = getValue();
                return (
                    <div className="flex items-center gap-2">
                        {status === 'Confirmed' && <CheckCircle2 size={14} className="text-emerald-500" />}
                        {status === 'Pending' && <Clock size={14} className="text-orange-500" />}
                        {status === 'Completed' && <CheckCircle2 size={14} className="text-slate-400" />}
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{status}</span>
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
                <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button

                        onClick={() => {
                            setSelectedMeeting(row.original);
                            setIsModalOpen(true);
                        }}
                        className="p-2 hover:bg-blue-600 cursor-pointer hover:text-white rounded-lg transition-colors text-slate-800"
                        title="Join Call"
                    >
                        <Video size={18} />
                    </button>
                </div>
            )
        }
    ], []);

    const table = useReactTable({
        data: data?.meetings || [],
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    if (isPending) return <div className="p-20 text-center font-bold text-slate-400">LOADING PIPELINE...</div>;
    if (isError) return <div className="p-20 text-center text-red-500 font-bold uppercase tracking-widest">Error: {error.message}</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                        Session <span className="text-blue-600">Pipeline</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">
                        Manage your strategy calls and affiliate intake
                    </p>
                </div>
                {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 font-bold shadow-lg shadow-blue-500/20">
                    <UserPlus size={18} className="mr-2" /> Manual Entry
                </Button> */}
            </div>

            {/* SEARCH */}
            <Card className="p-4 border-slate-200 shadow-sm bg-white/50 backdrop-blur-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Filter by name, email, status or date..."
                        className="pl-10 bg-white border-slate-200 rounded-xl focus:ring-blue-500/20"
                    />
                </div>
            </Card>

            {/* TABLE */}
            <Card className="overflow-hidden border-slate-200 shadow-sm bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-6 py-5">
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            <AnimatePresence>
                                {table.getRowModel().rows.map(row => (
                                    <motion.tr
                                        key={row.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-blue-50/30 transition-colors group"
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="px-6 py-5">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            variant="outline" className="h-8 w-8 p-0 rounded-lg border-slate-200"
                        >
                            <ChevronRight size={16} className="rotate-180" />
                        </Button>
                        <Button
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            variant="outline" className="h-8 w-8 p-0 rounded-lg border-slate-200"
                        >
                            <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </Card>

            <StartMeetingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                meetingData={selectedMeeting}
            />
        </div>
    );
};

export default Meeting;