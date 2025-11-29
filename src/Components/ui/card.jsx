import React from "react";
import { cn } from "../../utils";

export function Card({ className = "", ...props }) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }) {
  return (
    <div className={cn("p-4 pb-0 flex flex-col space-y-1.5", className)} {...props} />
  );
}

export function CardTitle({ className = "", ...props }) {
  return <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardContent({ className = "", ...props }) {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}
