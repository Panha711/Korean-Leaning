"use client";

import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof LinearProgress> & { value?: number }
>(({ className, value, ...props }, ref) => (
  <LinearProgress
    ref={ref}
    variant="determinate"
    value={value ?? 0}
    className={cn("h-2 rounded-full", className)}
    sx={{
      borderRadius: 9999,
      bgcolor: "action.hover",
      "& .MuiLinearProgress-bar": {
        borderRadius: 9999,
      },
    }}
    {...props}
  />
));
Progress.displayName = "Progress";

export { Progress };
