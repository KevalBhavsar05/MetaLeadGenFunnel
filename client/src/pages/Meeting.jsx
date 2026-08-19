import React, { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  MessageSquare,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCancelMeeting, useFetchMeetings } from "@/hooks/useMeeting";
import StartMeetingModal from "@/components/common/StartMeetingModal";
import SpinnerLoader from "@/components/common/SpinnerLoader";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";

const Meeting = () => {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error } = useFetchMeetings();
  const cancelMeeting = useCancelMeeting();
  const [globalFilter, setGlobalFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [selectedFeedbackMeeting, setSelectedFeedbackMeeting] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);

  const to12HourFormat = (time24) => {
    if (!time24) return "";
    let [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const toLocalDateStr = (dateValue) => {
    const dateObj = new Date(dateValue);
    if (Number.isNaN(dateObj.getTime())) return "";
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const filteredMeetings = useMemo(() => {
    const meetings = data?.meetings || [];
    if (!startDate && !endDate) return meetings;

    return meetings.filter((meeting) => {
      const meetingDate = toLocalDateStr(meeting.date);
      if (startDate && !endDate) return meetingDate >= startDate;
      if (!startDate && endDate) return meetingDate <= endDate;
      return meetingDate >= startDate && meetingDate <= endDate;
    });
  }, [data?.meetings, startDate, endDate]);

  const escapeCsv = (value) => {
    const str = String(value ?? "");
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const clearDateRange = () => {
    setStartDate("");
    setEndDate("");
  };

  const handleCancelMeeting = useCallback(
    async (meetingId, reason) => {
      try {
        await cancelMeeting.mutateAsync({ meetingId, feedback: reason });
        await queryClient.invalidateQueries({ queryKey: ["meetings"] });
        toast.success("Meeting cancelled successfully");
      } catch (err) {
        toast.error(
          "Failed to cancel meeting: " +
            (err?.response?.data?.message || err.message),
        );
        throw err;
      }
    },
    [cancelMeeting, queryClient],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "userId.name",
        header: "Partner Information",
        cell: ({ row }) => {
          const user = row.original.userId;
          return (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-black text-blue-600">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0">
                <p className="font-black text-slate-950">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "userId.phone",
        header: "Phone Number",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-slate-700">
            {row.original.userId?.phone || "-"}
          </p>
        ),
      },
      {
        accessorKey: "date",
        header: "Schedule",
        cell: ({ row }) => (
          <div>
            <p className="text-sm font-black text-slate-950">
              {new Date(row.original.date).toLocaleDateString()}
            </p>
            <p className="text-xs font-black uppercase text-blue-600">
              {to12HourFormat(row.original.slotTime)}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ getValue }) => {
          const status = getValue();
          const style =
            status === "confirmed"
              ? "bg-blue-50 text-blue-700"
              : status === "pending"
                ? "bg-slate-100 text-slate-600"
                : "bg-red-50 text-red-600";
          return (
            <div
              className={`inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-black uppercase tracking-widest ${style}`}
            >
              {status === "confirmed" && <CheckCircle2 size={14} />}
              {status === "pending" && <Clock size={14} />}
              {status === "cancelled" && <Trash2 size={14} />}
              <span>{status}</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            {row.original.status !== "cancelled" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMeeting(row.original);
                    setIsModalOpen(true);
                  }}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                  title="Join Call"
                >
                  <Video size={17} />
                </button>
                <ConfirmationDialog
                  trigger={
                    <button
                      type="button"
                      className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                      title="Cancel Meeting"
                    >
                      <Trash2 size={17} />
                    </button>
                  }
                  title="Cancel Meeting"
                  description="Are you sure you want to cancel this meeting?"
                  confirmText="Cancel Meeting"
                  requireReason
                  reasonPlaceholder="Why are you cancelling this meeting?"
                  reasonLabel="Cancellation reason"
                  onConfirm={(reason) =>
                    handleCancelMeeting(row.original._id, reason)
                  }
                />
              </>
            )}
            {row.original.feedback && (
              <button
                type="button"
                onClick={() => setSelectedFeedbackMeeting(row.original)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                title="View Cancellation Feedback"
              >
                <MessageSquare size={17} />
              </button>
            )}
          </div>
        ),
      },
    ],
    [handleCancelMeeting],
  );

  const table = useReactTable({
    data: filteredMeetings,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportMeetingsToCsv = () => {
    const rows = table.getFilteredRowModel().rows;
    const headers = ["Name", "Email", "Phone", "Date", "Time", "Status", "Feedback"];
    const lines = [headers.join(",")];

    rows.forEach((row) => {
      const meeting = row.original;
      lines.push(
        [
          meeting?.userId?.name ?? "",
          meeting?.userId?.email ?? "",
          meeting?.userId?.phone ?? "",
          toLocalDateStr(meeting?.date),
          to12HourFormat(meeting?.slotTime),
          meeting?.status ?? "",
          meeting?.feedback ?? "",
        ]
          .map(escapeCsv)
          .join(","),
      );
    });

    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `meetings-${toLocalDateStr(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  if (isPending) return <SpinnerLoader className="h-screen" />;
  if (isError) {
    return (
      <div className="p-20 text-center font-bold text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-5 sm:p-6 lg:p-8">
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-blue-600">
          Admin Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Session History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage strategy calls and affiliate intake.
        </p>
      </div>

      <Card className="rounded-lg border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <Input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Filter by name, email, phone..."
              className="h-11 rounded-lg border-slate-200 bg-white pl-10 focus-visible:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() =>
                startDateInputRef.current?.showPicker?.() ||
                startDateInputRef.current?.focus()
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-blue-200"
            >
              <Calendar size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                From
              </span>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                ref={startDateInputRef}
                max={endDate || undefined}
                className="h-auto w-auto cursor-pointer border-0 bg-transparent p-0 shadow-none focus-visible:ring-blue-500/20"
              />
            </button>

            <button
              type="button"
              onClick={() =>
                endDateInputRef.current?.showPicker?.() ||
                endDateInputRef.current?.focus()
              }
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 transition hover:border-blue-200"
            >
              <Calendar size={14} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                To
              </span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                ref={endDateInputRef}
                min={startDate || undefined}
                className="h-auto w-auto cursor-pointer border-0 bg-transparent p-0 shadow-none focus-visible:ring-blue-500/20"
              />
            </button>

            {(startDate || endDate) && (
              <Button
                type="button"
                variant="link"
                onClick={clearDateRange}
                className="h-auto cursor-pointer p-0 text-xs font-black uppercase tracking-widest text-red-500 hover:text-red-600 hover:underline"
              >
                Clear Range
              </Button>
            )}

            <Button
              onClick={exportMeetingsToCsv}
              disabled={table.getFilteredRowModel().rows.length === 0}
              className="h-11 cursor-pointer rounded-lg bg-blue-600 px-5 font-black text-white hover:bg-blue-700 sm:ml-auto"
            >
              Export CSV
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden rounded-lg border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-5 py-4">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group transition hover:bg-blue-50/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-4">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              variant="outline"
              className="h-9 w-9 rounded-lg border-slate-200 p-0"
            >
              <ChevronRight size={16} className="rotate-180" />
            </Button>
            <Button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              variant="outline"
              className="h-9 w-9 rounded-lg border-slate-200 p-0"
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

      <AlertDialog
        open={Boolean(selectedFeedbackMeeting)}
        onOpenChange={(open) => {
          if (!open) setSelectedFeedbackMeeting(null);
        }}
      >
        <AlertDialogContent className="rounded-lg border-slate-200">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancellation Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedFeedbackMeeting?.userId?.name
                ? `${selectedFeedbackMeeting.userId.name}'s cancellation note`
                : "Feedback shared for this cancelled meeting"}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {selectedFeedbackMeeting?.feedback || "No feedback was provided."}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Meeting;
