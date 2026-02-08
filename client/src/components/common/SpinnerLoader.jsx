import React from "react";
import { LucideLoader, Settings2 } from "lucide-react"; // Note: Use Loader2 from lucide-react, which is often imported with shadcn/ui

export default function SpinnerLoader({ size = 20, color = "text-blue-900", className = "" }) {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Settings2 className="text-blue-600 animate-spin" size={40} />
        </div>
    );
}