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
    trigger, // React node
    title = "Are you sure?",
    description = "This action cannot be undone.",
    content = null,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm, // This is your async handleSubmit function
}) {
    // ⭐ 1. Add state to control the dialog's open status
    const [open, setOpen] = React.useState(false);

    // ⭐ 2. Create a stable, async handler that manages the confirmation logic
    const handleConfirm = async (event) => {
        // Prevent the default Radix close behavior initially
        event.preventDefault();

        // Execute the user's async onConfirm logic
        await onConfirm();

        // ⭐ 3. Manually close the dialog after the async operation is complete
        setOpen(false);
    };

    return (
        // ⭐ 4. Pass 'open' and 'onOpenChange' to the root AlertDialog
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {/* Pass down the trigger prop for the button */}
                {trigger}
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-[92vw] sm:max-w-md rounded-[2rem] sm:rounded-[2.5rem] border border-slate-200 bg-white shadow-2xl p-0 overflow-hidden">
                <AlertDialogHeader className="p-6 sm:p-8 space-y-2">
                    <AlertDialogTitle className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-900">
                        <AlertCircle className="inline mr-2 mb-1 text-blue-600" size={20} />
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm sm:text-base text-slate-500">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {content && (
                    <div className="px-6 sm:px-8 pb-2">
                        {content}
                    </div>
                )}

                {/* ⭐ Fixed Footer: Buttons in one row on mobile with proper spacing */}
                <AlertDialogFooter className="p-6 sm:p-8 pt-0 flex-row gap-2 sm:gap-3">
                    <AlertDialogCancel className="flex-1 m-0 rounded-xl border-slate-200 text-sm sm:text-base">
                        {cancelText}
                    </AlertDialogCancel>

                    {/* ⭐ 5. Pass the new handler to onClick.
               We prevent the default submit/close, run the async function, then close.
          */}
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="flex-1 m-0 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ConfirmationDialog;