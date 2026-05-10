import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "relative group border text-foreground text-center rounded-full inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:pointer-events-none disabled:opacity-50 min-h-11",
  {
    variants: {
      variant: {
        default:
          "bg-yellow-400/10 hover:bg-yellow-400/5 border-yellow-400/30 text-white",
        solid:
          "bg-yellow-400 hover:bg-yellow-500 text-black border-transparent hover:border-white/20 transition-all duration-200",
        ghost:
          "border-transparent bg-transparent hover:border-white/20 hover:bg-white/10 text-white",
        outline:
          "border border-yellow-400/30 bg-transparent text-white hover:bg-yellow-400/10",
        secondary:
          "bg-white/[0.05] text-white border border-white/10 hover:bg-white/[0.1] hover:border-yellow-400/30",
      },
      size: {
        default: "px-7 py-1.5",
        sm: "px-4 py-0.5 text-xs min-h-9",
        lg: "px-10 py-2.5 text-base min-h-12",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  neon?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, neon = true, children, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-yellow-400 to-transparent hidden",
            neon && "block"
          )}
        />
        {children}
        <span
          className={cn(
            "absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-yellow-400 to-transparent hidden",
            neon && "block"
          )}
        />
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
