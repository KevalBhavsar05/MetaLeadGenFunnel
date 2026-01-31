import React from "react";
import { LucideLoader } from "lucide-react"; // Note: Use Loader2 from lucide-react, which is often imported with shadcn/ui

export default function SpinnerLoader({ size = 20, color = "text-blue-900" }) {
    return (
        <div className="flex items-center justify-center h-full w-full animate-pulse">
            <LucideLoader
                className={`h-${size} w-${size} ${color} animate-spin`}
            />
        </div>
    );
}