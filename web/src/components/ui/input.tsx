import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "block w-full rounded-none border-b border-dashed border-(--color-muted-foreground)/50 bg-transparent px-0 py-1.5 text-base text-(--color-foreground) placeholder:text-(--color-muted-foreground)/40 outline-none transition-colors font-mono",
        "focus-visible:border-(--color-foreground) focus-visible:ring-0",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "aria-invalid:border-(--color-destructive) aria-invalid:focus-visible:border-(--color-destructive)",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
