import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-2 text-base text-(--color-foreground) file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-(--color-muted-foreground) outline-none transition-all shadow-sm",
        "focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-ring) focus-visible:bg-(--color-background)",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-(--color-destructive) aria-invalid:focus-visible:ring-(--color-destructive)/30",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
