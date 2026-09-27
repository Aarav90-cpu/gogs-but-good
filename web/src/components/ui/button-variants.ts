import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold outline-none transition-all focus-visible:ring-2 focus-visible:ring-(--color-ring) disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-(--color-primary) text-(--color-primary-foreground) hover:bg-(--color-primary)/90 shadow-sm hover:shadow-md",
        outline: "border border-(--color-border) bg-(--color-surface) text-(--color-foreground) hover:bg-(--color-muted) shadow-sm",
        ghost: "text-(--color-foreground) hover:bg-(--color-muted) hover:text-(--color-foreground)",
        link: "text-(--color-primary) underline-offset-4 hover:underline",
        destructive:
          "bg-(--color-destructive) text-(--color-destructive-foreground) hover:bg-(--color-destructive)/90 shadow-sm",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 rounded-full",
        icon: "size-11 rounded-full",
        inline: "h-auto p-0 rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
