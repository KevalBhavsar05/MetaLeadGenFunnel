import * as React from "react"

import { cn } from "@/lib/utils"

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[2px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        {
          "focus:ring-gray-300 placeholder:text-black/70 focus:border-gray-400 border-gray-300": type === 'email' || type === 'number' || type === 'text' || type === 'password' || type === 'time' || type === 'number' || type === 'date' || type === 'tel',
        },
        {
          "focus:ring-gray-300 placeholder:text-black/70 focus:border-gray-400 border-gray-300 cursor-pointer bg-white text-black hover:bg-gray-100  ease-in  shadow-md hover:shadow-lg transition-colors": type === 'time',
        },
        className
      )}
      {...props} />
  );
}

export { Input }