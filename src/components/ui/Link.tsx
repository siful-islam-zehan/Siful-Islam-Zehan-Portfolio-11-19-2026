import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { clsx } from "clsx";

export interface EditorialLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof NextLinkProps>,
    NextLinkProps {
  variant?: "underline" | "arrow" | "pill" | "plain";
  external?: boolean;
  children: React.ReactNode;
}

export const Link: React.FC<EditorialLinkProps> = ({
  href,
  variant = "underline",
  external = false,
  className,
  children,
  ...props
}) => {
  const isExternal =
    external || (typeof href === "string" && (href.startsWith("http://") || href.startsWith("https://")));

  const baseStyles =
    "inline-flex items-center text-foreground transition-all duration-300 ease-editorial";

  const variantStyles = {
    underline:
      "relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-foreground hover:opacity-70",
    arrow: "group hover:opacity-70",
    pill: "border border-border rounded-pill px-4 py-1.5 type-label hover:border-foreground bg-background",
    plain: "hover:opacity-70",
  };

  const content = (
    <>
      <span>{children}</span>
      {variant === "arrow" && (
        <span className="ml-1.5 transition-transform duration-300 ease-editorial group-hover:translate-x-1">
          →
        </span>
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href.toString()}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(baseStyles, variantStyles[variant], className)}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <NextLink
      href={href}
      className={clsx(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {content}
    </NextLink>
  );
};
