"use client";

import * as React from "react";
import Chip from "@mui/material/Chip";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "destructive" | "outline";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

function Badge({ className, variant = "default", children, ...props }: BadgeProps) {
  const color =
    variant === "destructive"
      ? "error"
      : variant === "secondary"
        ? "default"
        : "primary";

  const chipVariant =
    variant === "outline" ? "outlined" : variant === "secondary" ? "filled" : "filled";

  return (
    <Chip
      label={children}
      size="small"
      color={color}
      variant={chipVariant}
      className={cn(className)}
      sx={{
        height: "auto",
        fontSize: "0.75rem",
        fontWeight: 600,
        ...(variant === "default" && {
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }),
        ...(variant === "secondary" && {
          bgcolor: "action.hover",
        }),
      }}
      {...(props as React.ComponentProps<typeof Chip>)}
    />
  );
}

export { Badge };
