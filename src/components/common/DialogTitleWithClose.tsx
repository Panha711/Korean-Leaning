"use client";

import type { ReactNode } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import type { SxProps, Theme } from "@mui/material/styles";

interface DialogTitleWithCloseProps {
  onClose: () => void;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export function DialogTitleWithClose({
  onClose,
  children,
  sx,
}: DialogTitleWithCloseProps) {
  return (
    <DialogTitle sx={{ pr: 6, ...sx }}>
      {children}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
}
