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
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <Chip
            key={opt.id}
            label={opt.label}
            onClick={() => onChange(opt.id as T)}
            clickable
            sx={{
              fontWeight: 600,
              fontSize: "0.8125rem",
              borderRadius: 999,
              height: 34,
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
