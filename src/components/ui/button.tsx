"use client";

import * as React from "react";
import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import { cn } from "@/lib/utils";

type Variant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type Size = "default" | "sm" | "lg" | "icon";

const variantMap: Record<
  Variant,
  MuiButtonProps["variant"] | "text"
> = {
  default: "contained",
  destructive: "contained",
  outline: "outlined",
  secondary: "contained",
  ghost: "text",
  link: "text",
};

const colorMap: Record<Variant, MuiButtonProps["color"]> = {
  default: "primary",
  destructive: "error",
  outline: "primary",
  secondary: "secondary",
  ghost: "inherit",
  link: "primary",
};

const sizeMap: Record<Size, MuiButtonProps["size"]> = {
  default: "medium",
  sm: "small",
  lg: "large",
  icon: "small",
};

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "color"> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      fullWidth,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const muiVariant = variantMap[variant];
    const muiColor = colorMap[variant];
    const muiSize = size === "icon" ? "small" : sizeMap[size];

    const sx: MuiButtonProps["sx"] = {
      ...(variant === "link" && {
        textDecoration: "underline",
        textUnderlineOffset: 4,
        minWidth: 0,
        p: 0,
      }),
      ...(size === "icon" && {
        minWidth: 40,
        width: 40,
        height: 40,
        p: 0,
      }),
    };

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<Record<string, unknown>>;
      return (
        <MuiButton
          component={child.type as React.ElementType}
          {...child.props}
          ref={ref}
          variant={muiVariant}
          color={muiColor}
          size={muiSize}
          sx={sx}
          className={cn(className, child.props.className as string | undefined)}
        />
      );
    }

    return (
      <MuiButton
        ref={ref}
        type={type}
        variant={muiVariant}
        color={muiColor}
        size={muiSize}
        fullWidth={fullWidth}
        className={className}
        sx={sx}
        {...(props as MuiButtonProps)}
      >
        {children}
      </MuiButton>
    );
  }
);
Button.displayName = "Button";

export { Button };
