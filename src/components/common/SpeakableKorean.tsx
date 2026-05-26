"use client";

import type { MouseEvent } from "react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography, { type TypographyProps } from "@mui/material/Typography";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { extractKorean, hasKorean, speakKorean } from "@/lib/tts";

type SpeakableKoreanProps = Omit<
  TypographyProps<"button">,
  "onClick" | "component"
> & {
  text: string;
};

/**
 * Renders Korean text as a button that speaks the text when clicked.
 * Drop-in replacement for <Typography> showing Korean.
 */
export function SpeakableKorean({
  text,
  sx,
  children,
  ...rest
}: SpeakableKoreanProps) {
  return (
    <Typography
      {...rest}
      component="button"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speakKorean(text);
      }}
      aria-label={`Play pronunciation: ${text}`}
      sx={{
        display: "inline-block",
        background: "none",
        border: 0,
        p: 0,
        m: 0,
        color: "inherit",
        textAlign: "left",
        cursor: "pointer",
        transition: "color 0.15s",
        "&:hover": { color: "primary.main" },
        "&:focus-visible": {
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
          borderRadius: 4,
        },
        ...sx,
      }}
    >
      {children ?? text}
    </Typography>
  );
}

/**
 * Small speaker icon button — use when Korean text is mixed with other
 * languages inside an existing element you don't want to wrap as a button.
 * Extracts and speaks only the Korean portion of `text`.
 */
export function SpeakKoreanIconButton({
  text,
  size = "small",
}: {
  text: string;
  size?: "small" | "medium" | "large";
}) {
  if (!hasKorean(text)) return null;
  const handle = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const korean = extractKorean(text);
    if (korean) speakKorean(korean);
  };
  return (
    <Tooltip title="Play Korean pronunciation">
      <IconButton
        size={size}
        onClick={handle}
        aria-label="Play Korean pronunciation"
      >
        <VolumeUpIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
