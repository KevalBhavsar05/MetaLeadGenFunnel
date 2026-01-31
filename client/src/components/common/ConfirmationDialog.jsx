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

            <AlertDialogContent className="max-w-[90vw] sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-base sm:text-lg">
                        <AlertCircle className="inline mr-2 mb-1 text-red-600" size={20} />
                        {title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm sm:text-base">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {/* ⭐ Fixed Footer: Buttons in one row on mobile with proper spacing */}
                <AlertDialogFooter className="flex-row gap-2 sm:gap-3">
                    <AlertDialogCancel className="flex-1 m-0 text-sm sm:text-base">
                        {cancelText}
                    </AlertDialogCancel>

                    {/* ⭐ 5. Pass the new handler to onClick. 
               We prevent the default submit/close, run the async function, then close.
          */}
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="flex-1 m-0 text-sm sm:text-base"
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ConfirmationDialog;