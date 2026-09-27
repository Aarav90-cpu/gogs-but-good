import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer flex size-5 shrink-0 items-center justify-center rounded-lg border-2 border-(--color-border) bg-(--color-surface) outline-none transition-colors",
      "focus-visible:border-(--color-primary) focus-visible:ring-2 focus-visible:ring-(--color-ring)",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:border-(--color-primary) data-[state=checked]:bg-(--color-primary) data-[state=checked]:text-(--color-primary-foreground)",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center">
      <Check className="size-4" strokeWidth={3} aria-hidden />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
