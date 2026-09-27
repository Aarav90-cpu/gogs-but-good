import { cva } from "class-variance-authority";

export const toggleVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl text-sm font-semibold text-(--color-muted-foreground) outline-none transition-colors hover:bg-(--color-surface) hover:text-(--color-foreground) focus-visible:ring-2 focus-visible:ring-(--color-ring) disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-(--color-surface) data-[state=on]:text-(--color-foreground)",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-(--color-border) bg-transparent hover:bg-(--color-surface) data-[state=on]:border-(--color-primary) data-[state=on]:bg-(--color-primary)/10 data-[state=on]:text-(--color-primary)",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 rounded-lg",
        tile: "h-auto flex-col px-3 py-2 text-xs rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
