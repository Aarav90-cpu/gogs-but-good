import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-none text-base font-mono outline-none transition-colors focus-visible:ring-1 focus-visible:ring-(--color-ring) disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "border border-(--color-primary) bg-transparent text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-primary-foreground)",
        outline: "border border-(--color-input) bg-transparent text-(--color-foreground) hover:bg-(--color-surface)",
        ghost: "text-(--color-foreground) hover:bg-(--color-surface)",
        link: "text-(--color-foreground) underline-offset-4 hover:[animation:flame-flicker_2.4s_ease-in-out_infinite]",
        destructive:
          "border border-(--color-destructive) bg-transparent text-(--color-destructive) hover:bg-(--color-destructive) hover:text-(--color-destructive-foreground)",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        icon: "size-9",
        inline: "h-auto p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
