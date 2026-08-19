import * as React from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

function ConfirmationDialog({
    trigger,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    content = null,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    requireReason = false,
    reasonPlaceholder = "Please provide a reason...",
    reasonLabel = "Reason",
}) {
    const [open, setOpen] = React.useState(false);
    const [reason, setReason] = React.useState("");

    const handleConfirm = async (event) => {
        event.preventDefault();

        if (requireReason) {
            await onConfirm(reason);
        } else {
            await onConfirm();
        }

        // Reset and close
        setReason("");
        setOpen(false);
    };

    // Reset reason when dialog closes
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
            setReason("");
        }
    };
    const isConfirmDisabled = requireReason && reason.trim().length === 0;

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-[92vw] gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white p-0 shadow-2xl shadow-slate-950/15 sm:max-w-md">
                <AlertDialogHeader className="border-b border-slate-100 bg-slate-50 px-5 py-5 text-left sm:px-6">
                    <AlertDialogTitle className="flex items-center gap-3 text-lg font-black tracking-tight text-slate-950">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <AlertCircle size={20} />
                        </span>
                        <span>{title}</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="mt-2 text-sm leading-6 text-slate-500">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4 px-5 py-5 sm:px-6">
                    {requireReason && (
                        <div>
                            <label className="mb-2 block text-[11px] font-black uppercase tracking-widest text-slate-500">
                                {reasonLabel}
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder={reasonPlaceholder}
                                className="min-h-24 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                rows={3}
                            />
                        </div>
                    )}

                    {content && <div>{content}</div>}
                </div>

                <AlertDialogFooter className="flex-row gap-2 border-t border-slate-100 bg-white px-5 py-4 sm:gap-3 sm:px-6">
                    <AlertDialogCancel className="m-0 h-11 flex-1 cursor-pointer rounded-lg text-sm font-bold">
                        {cancelText}
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        className="m-0 h-11 flex-1 cursor-pointer rounded-lg bg-blue-600 text-sm font-black text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ConfirmationDialog;
