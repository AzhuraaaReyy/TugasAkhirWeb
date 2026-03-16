import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-xl bg-red-500 border border-gray-200 shadow-sm transition-all",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({ className, children }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
