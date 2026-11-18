import React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "pill" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, icon, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-sans font-medium transition-all duration-300 ease-editorial select-none disabled:opacity-40 disabled:pointer-events-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-foreground text-dark-foreground border border-foreground hover:bg-transparent hover:text-foreground",
      secondary:
        "bg-transparent text-foreground border border-border hover:border-foreground",
      pill:
        "bg-background text-foreground border border-border rounded-pill hover:border-foreground type-label",
      outline:
        "bg-transparent text-foreground border border-border hover:border-foreground",
    };

    const sizeStyles = {
      sm: variant === "pill" ? "px-3 py-1 text-xs" : "px-4 py-2 text-xs rounded-sm",
      md: variant === "pill" ? "px-5 py-2 text-xs" : "px-6 py-3 text-sm rounded-sm",
      lg: variant === "pill" ? "px-7 py-3 text-sm" : "px-8 py-4 text-base rounded-sm",
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        <span>{children}</span>
        {icon && <span className="ml-2 inline-flex items-center">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
