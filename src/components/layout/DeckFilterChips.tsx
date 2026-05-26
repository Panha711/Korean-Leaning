"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { alpha, useTheme } from "@mui/material/styles";

export interface DeckFilterOption {
  id: string;
  label: string;
}

export interface DeckFilterChipsProps<T extends string> {
  options: DeckFilterOption[];
  value: T;
  onChange: (id: T) => void;
}

export function DeckFilterChips<T extends string>({
  options,
  value,
  onChange,
}: DeckFilterChipsProps<T>) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Stack
      direction="row"
      sx={{
        gap: 1,
        flexWrap: { xs: "nowrap", sm: "wrap" },
        overflowX: { xs: "auto", sm: "visible" },
        overflowY: "hidden",
        mx: { xs: -1.25, sm: 0 },
        px: { xs: 1.25, sm: 0 },
        pb: 0,
        scrollSnapType: { xs: "x proximity", sm: "none" },
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": { display: "none", height: 0, width: 0 },
      }}
    >
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <Chip
            key={opt.id}
            label={opt.label}
            onClick={() => onChange(opt.id as T)}
            clickable
            sx={{
              flexShrink: 0,
              scrollSnapAlign: "start",
              fontWeight: 600,
              fontSize: { xs: "0.75rem", sm: "0.8125rem" },
              borderRadius: 999,
              height: { xs: 30, sm: 34 },
              "& .MuiChip-label": { px: { xs: 1, sm: 1.5 } },
              bgcolor: active
                ? "primary.main"
                : isDark
                  ? alpha("#fff", 0.06)
                  : alpha("#000", 0.04),
              color: active ? "primary.contrastText" : "text.primary",
              border: 1,
              borderColor: active
                ? "primary.main"
                : isDark
                  ? alpha("#fff", 0.1)
                  : "divider",
              boxShadow: active
                ? `0 2px 10px ${alpha(theme.palette.primary.main, 0.35)}`
                : "none",
              "&:hover": {
                bgcolor: active
                  ? "primary.dark"
                  : isDark
                    ? alpha("#fff", 0.1)
                    : alpha("#000", 0.06),
              },
            }}
          />
        );
      })}
    </Stack>
  );
}
