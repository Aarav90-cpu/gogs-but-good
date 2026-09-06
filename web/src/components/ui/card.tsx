import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-lg border border-(--color-foreground)/80 bg-(--color-surface)/40 font-mono shadow-xs dark:border-(--color-border) overflow-hidden",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-1.5 border-b border-(--color-foreground)/80 px-3 py-2 sm:px-4 sm:py-2.5 dark:border-(--color-border)">
        <span className="size-2.5 rounded-full bg-(--color-destructive)/70" />
        <span className="size-2.5 rounded-full bg-(--color-warning,oklch(0.795_0.184_86.047))/70" />
        <span className="size-2.5 rounded-full bg-(--color-foreground)/20" />
        <span className="ml-2 text-xs text-(--color-muted-foreground) sm:ml-3">gogs — zsh</span>
      </div>
      <div className="font-pixel text-sm leading-relaxed text-(--color-foreground) sm:text-base">{props.children}</div>
    </div>
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 px-5 pt-5 sm:px-6 sm:pt-6", className)} {...props} />;
}

function CardTitle({ className, children, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2 className={cn("text-base sm:text-lg text-(--color-foreground)", className)} {...props}>
      <span className="text-(--color-muted-foreground)">$ </span>
      <span>{children}</span>
    </h2>
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-(--color-muted-foreground)", className)} {...props} />;
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-5 py-5 sm:px-6 sm:py-6", className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex items-center px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
