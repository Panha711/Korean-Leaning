"use client";

import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";
import type { SvgIconComponent } from "@mui/icons-material";

const KHMER_FONT = "var(--font-noto-khmer), 'Noto Sans Khmer', sans-serif";

export interface StudyModuleCardProps {
  href: string;
  title: string;
  titleKhmer: string;
  description: string;
  countLabel: string;
  breakdown?: readonly string[];
  icon: SvgIconComponent;
  accent: string;
}

export function StudyModuleCard({
  href,
  title,
  titleKhmer,
  description,
  countLabel,
  breakdown = [],
  icon: Icon,
  accent,
}: StudyModuleCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const khmerColor = isDark ? "#fde68a" : "#b45309";
  const englishMuted = isDark ? "#93c5fd" : "#1e40af";

  return (
    <Link
      href={href}
      prefetch={false}
      style={{
        display: "block",
        height: "100%",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: `linear-gradient(145deg, ${alpha(accent, isDark ? 0.14 : 0.07)} 0%, transparent 55%)`,
            pointerEvents: "none",
          },
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: isDark
              ? `0 20px 40px ${alpha("#000", 0.45)}`
              : `0 20px 40px ${alpha(accent, 0.18)}`,
            borderColor: alpha(accent, 0.45),
            "& .module-cta": {
              bgcolor: accent,
              color: "#fff",
            },
            "& .module-icon-wrap": {
              transform: "scale(1.05)",
            },
          },
        }}
      >
        <Stack
          spacing={{ xs: 1.25, sm: 2 }}
          sx={{ p: { xs: 1.75, sm: 2.75 }, flex: 1, position: "relative" }}
        >
          <Stack
            direction="row"
            spacing={{ xs: 1.5, sm: 2 }}
            sx={{ alignItems: "center" }}
          >
            <Box
              className="module-icon-wrap"
              sx={{
                flexShrink: 0,
                width: { xs: 44, sm: 56 },
                height: { xs: 44, sm: 56 },
                borderRadius: { xs: 2, sm: 2.5 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${accent} 0%, ${alpha(accent, 0.75)} 100%)`,
                boxShadow: `0 8px 20px ${alpha(accent, 0.35)}`,
                transition: "transform 0.22s ease",
              }}
            >
              <Icon sx={{ fontSize: { xs: 22, sm: 28 }, color: "#fff" }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                component="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.05rem", sm: "1.35rem" },
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  mt: 0.25,
                  fontFamily: KHMER_FONT,
                  fontSize: { xs: "0.8125rem", sm: "0.95rem" },
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: khmerColor,
                }}
              >
                {titleKhmer}
              </Typography>
            </Box>
            <Chip
              label={countLabel}
              size="small"
              sx={{
                display: { xs: "inline-flex", sm: "none" },
                alignSelf: "center",
                height: 24,
                fontWeight: 700,
                fontSize: "0.7rem",
                bgcolor: alpha(accent, isDark ? 0.22 : 0.1),
                color: accent,
                border: 1,
                borderColor: alpha(accent, 0.25),
                "& .MuiChip-label": { px: 1 },
              }}
            />
          </Stack>

          <Chip
            label={countLabel}
            size="small"
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              alignSelf: "flex-start",
              height: 28,
              fontWeight: 700,
              fontSize: "0.75rem",
              bgcolor: alpha(accent, isDark ? 0.22 : 0.1),
              color: accent,
              border: 1,
              borderColor: alpha(accent, 0.25),
              "& .MuiChip-label": { px: 1.25 },
            }}
          />

          {breakdown.length > 0 ? (
            <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5 }}>
              {breakdown.map((label) => (
                <Typography
                  key={label}
                  variant="caption"
                  sx={{
                    px: { xs: 0.75, sm: 1 },
                    py: { xs: 0.25, sm: 0.35 },
                    borderRadius: 1,
                    fontWeight: 600,
                    fontSize: { xs: "0.65rem", sm: "0.68rem" },
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                    bgcolor: alpha(theme.palette.text.primary, 0.06),
                    color: "text.secondary",
                  }}
                >
                  {label}
                </Typography>
              ))}
            </Stack>
          ) : null}

          <Typography
            variant="body2"
            sx={{
              flex: 1,
              lineHeight: { xs: 1.45, sm: 1.6 },
              color: "text.secondary",
              fontSize: { xs: "0.8125rem", sm: "0.9rem" },
              display: { xs: "-webkit-box", sm: "block" },
              WebkitLineClamp: { xs: 2, sm: "unset" },
              WebkitBoxOrient: "vertical",
              overflow: { xs: "hidden", sm: "visible" },
            }}
          >
            {description}
          </Typography>

          <Box
            className="module-cta"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
              alignSelf: "flex-start",
              mt: { xs: 0, sm: 0.5 },
              px: { xs: 1.5, sm: 2 },
              py: { xs: 0.6, sm: 0.85 },
              borderRadius: 2,
              fontWeight: 700,
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              bgcolor: alpha(accent, isDark ? 0.2 : 0.12),
              color: englishMuted,
              transition: "background-color 0.22s ease, color 0.22s ease",
            }}
          >
            Open
            <ArrowForwardIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
          </Box>
        </Stack>
      </Card>
    </Link>
  );
}
