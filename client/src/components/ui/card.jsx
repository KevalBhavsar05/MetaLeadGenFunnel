import * as React from "react";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

// Define Card variants
// Add new variant "quick" for Quick Access cards
const cardVariants = cva(
  "flex flex-col gap-6 rounded-lg py-6 transition-all",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-lg hover:shadow-xl hover:scale-101",
        outlined: "bg-background text-card-foreground border border-border shadow-none",
        elevated: "bg-card text-card-foreground shadow-2xl",
        migrate: "bg-white/80 text-card-foreground shadow-lg border border-gray-300 ",
        stusub: "bg-white text-card-foreground shadow-lg border-2 border-gray-200 ",
        migratesm: "bg-white text-white border border-gray-200 shadow-sm hover:shadow-xl",
        markatd: "bg-white text-card-foreground shadow-md hover:shadow-lg",
        facultySelect: "p-4 bg-white shadow-sm  hover:shadow-md",
        stdAtd: "flex flex-col items-center p-6 hover:shadow-lg transition-all duration-300  hover:border-blue-200 group",
        moduleItem: "bg-white border border-gray-100 shadow-md hover:shadow-lg hover:border-blue-100",
        viewsub: "bg-white text-gray-800 flex flex-col items-center justify-center transition-all",
        noHover: "bg-card text-card-foreground shadow-lg hover:shadow-xl", // Removed hover:scale-101
        quick: "bg-white text-card-foreground shadow-md hover:shadow-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-105",
      },
      size: {
        default: "p-6",
        sm: "p-4",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


function Card({ className, variant, size, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, size, className }))}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }) {
  return (
    <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...props} />
  );
}

function CardDescription({ className, ...props }) {
  return (
    <div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
  );
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}

function CardFooter({ className, ...props }) {
  return (
    <div data-slot="card-footer" className={cn("flex items-center px-6 [.border-t]:pt-6", className)} {...props} />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };