import React from "react";
import { cn } from "../../utils";

export function Badge({ className = "", variant = "default", ...props }) {
  const variants = {
    default:
      "inline-flex items-center rounded-full border border-transparent bg-primary text-primary-foreground px-2.5 py-0.5 text-xs font-semibold",
    secondary:
      "inline-flex items-center rounded-full border border-transparent bg-secondary text-secondary-foreground px-2.5 py-0.5 text-xs font-semibold",
    outline:
      "inline-flex items-center rounded-full border border-input text-foreground px-2.5 py-0.5 text-xs font-semibold",
  };

  return (
    <span className={cn(variants[variant], className)} {...props} />
  );
}
