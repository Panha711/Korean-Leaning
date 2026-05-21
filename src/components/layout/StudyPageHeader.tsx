"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";

const KHMER_FONT = "var(--font-noto-khmer), 'Noto Sans Khmer', sans-serif";

export interface StudyPageHeaderProps {
  icon: SvgIconComponent;
  title: string;
  titleKhmer?: string;
  accent?: string;
}

export function StudyPageHeader({
  icon: Icon,
  title,
  titleKhmer,
  accent = "#7c3aed",
}: StudyPageHeaderProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const khmerColor = isDark ? "#fde68a" : "#b45309";

  return (
    <Box
      sx={{
        pb: 1.5,
        borderBottom: 3,
        borderColor: accent,
        borderRadius: "0 0 2px 2px",
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${accent} 0%, ${alpha(accent, 0.75)} 100%)`,
            color: "#fff",
            boxShadow: `0 6px 16px ${alpha(accent, 0.4)}`,
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 24 }} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </Typography>
          {titleKhmer ? (
            <Typography
              sx={{
                fontFamily: KHMER_FONT,
                fontWeight: 600,
                fontSize: "0.9rem",
                color: khmerColor,
                lineHeight: 1.3,
                mt: 0.2,
              }}
            >
              {titleKhmer}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Box>
  );
}
