"use client";

import * as React from "react";
import MuiAvatar from "@mui/material/Avatar";
import { cn } from "@/lib/utils";

const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <span ref={ref} className={cn(className)} {...props}>
    {children}
  </span>
));
AvatarFallback.displayName = "AvatarFallback";

const AvatarImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(() => null);
AvatarImage.displayName = "AvatarImage";

const Avatar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof MuiAvatar>
>(({ className, children, sx, ...props }, ref) => {
  let content: React.ReactNode = children;
  let fallbackClassName: string | undefined;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === AvatarFallback) {
      const props = child.props as React.HTMLAttributes<HTMLDivElement>;
      content = props.children;
      fallbackClassName = props.className;
    }
  });

  return (
    <MuiAvatar
      ref={ref}
      className={cn("h-10 w-10", className, fallbackClassName)}
      sx={sx}
      {...props}
    >
      {content}
    </MuiAvatar>
  );
});
Avatar.displayName = "Avatar";

export { Avatar, AvatarImage, AvatarFallback };
