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
    ChevronRight,
    Mail,
    Search,
    Trash2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import ConfirmationDialog from "@/components/common/ConfirmationDialog";

import { useFetchUsers } from "@/hooks/useUser";
import SpinnerLoader from "./SpinnerLoader";
import { toast } from "sonner";

const Users = () => {
    const queryClient = useQueryClient();
    const { data, isPending, isError, error } = useFetchUsers();
    // const deleteUser = useDeleteUser();

    const [globalFilter, setGlobalFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const startDateInputRef = useRef(null);
    const endDateInputRef = useRef(null);

    const toLocalDateStr = (dateValue) => {
        if (!dateValue) return "";
        const dateObj = new Date(dateValue);
        if (Number.isNaN(dateObj.getTime())) return "";
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, "0");
        const d = String(dateObj.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    const filteredUsers = useMemo(() => {
        const users = data?.users || [];
        if (!startDate && !endDate) return users;

        return users.filter((user) => {
            const joinDate = toLocalDateStr(user.createdAt);
            if (startDate && !endDate) return joinDate >= startDate;
            if (!startDate && endDate) return joinDate <= endDate;
            return joinDate >= startDate && joinDate <= endDate;
        });
    }, [data?.users, startDate, endDate]);

    const escapeCsv = (value) => {
        const str = String(value ?? "");
        if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
        return str;
    };

    const clearDateRange = () => {
        setStartDate("");
        setEndDate("");
    };

    const handleDeleteUser = useCallback(
        async (userId) => {
            try {
                await deleteUser.mutateAsync(userId);
                await queryClient.invalidateQueries({ queryKey: ["users"] });
                toast.success("User deleted successfully");
            } catch (err) {
                toast.error(
                    "Failed to delete user: " +
                    (err?.response?.data?.message || err.message),
                );
            }
        },
        [queryClient],
    );

    const columns = useMemo(
        () => [
            {
                accessorFn: (row) => `${row.name} ${row.email}`, // combined for global text search
                id: "userInfo",
                header: "User Information",
                cell: ({ row }) => {
                    const user = row.original;
                    return (
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 font-black text-blue-600">
                                {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0">
                                <p className="font-black text-slate-950">
                                    {user.name || "Unknown Name"}
                                </p>
                                <p className="truncate text-xs text-slate-500">{user.email}</p>
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "phone",
                header: "Phone Number",
                cell: ({ row }) => (
                    <p className="text-sm font-bold text-slate-700">
                        {row.original.phone || "-"}
                    </p>
                ),
            },
            {
                accessorKey: "createdAt",
                header: "Joined Date",
                cell: ({ row }) => (
                    <div>
                        <p className="text-sm font-black text-slate-950">
                            {new Date(row.original.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs font-black uppercase text-slate-500">
                            {new Date(row.original.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                ),
            },
            {
                id: "actions",
                header: () => <div className="text-right">Actions</div>,
                cell: ({ row }) => (
                    <div className="flex justify-end gap-2">
                        <a
                            href={`mailto:${row.original.email}`}
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                            title="Email User"
                        >
                            <Mail size={17} />
                        </a>
                        {/* <ConfirmationDialog
                            trigger={
                                <button
                                    type="button"
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                                    title="Delete User"
                                >
                                    <Trash2 size={17} />
                                </button>
                            }
                            title="Delete User"
                            description={`Are you sure you want to delete ${row.original.name || row.original.email}? This action cannot be undone.`}
                            confirmText="Delete User"
                            onConfirm={() => handleDeleteUser(row.original._id)}
                        /> */}
                    </div>
                ),
            },
        ],
        [handleDeleteUser],
    );

    const table = useReactTable({
        data: filteredUsers,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const exportUsersToCsv = () => {
        const rows = table.getFilteredRowModel().rows;
        const headers = ["Name", "Email", "Phone", "Joined Date"];
        const lines = [headers.join(",")];

        rows.forEach((row) => {
            const user = row.original;
            const hasGoogleAuth = !!user.googleAccessToken || !!user.googleRefreshToken;

            lines.push(
                [
                    user.name ?? "",
                    user.email ?? "",
                    user.phone ?? "",
                    toLocalDateStr(user.createdAt),
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
        link.setAttribute("download", `users-${toLocalDateStr(new Date())}.csv`);
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
                    User Directory
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Manage your platform users, view their information, and monitor registration history.
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
                            placeholder="Search by name, email, or phone..."
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
                            onClick={exportUsersToCsv}
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
        </div>
    );
};

export default Users;