"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const KHMER_FONT = "var(--font-noto-khmer), 'Noto Sans Khmer', sans-serif";
const KOREAN_FONT =
  "var(--font-noto-sans-kr), 'Noto Sans KR', 'Malgun Gothic', sans-serif";

export function HomeHero() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 4,
        px: { xs: 2.5, sm: 3.5 },
        py: { xs: 3, sm: 3.5 },
        border: 1,
        borderColor: "divider",
        background: isDark
          ? "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(37,99,235,0.12) 50%, rgba(5,150,105,0.1) 100%)"
          : "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(37,99,235,0.06) 50%, rgba(5,150,105,0.05) 100%)",
      }}
    >
      <Stack spacing={1} sx={{ position: "relative", maxWidth: 560 }}>
        <Typography
          component="h1"
          sx={{
            fontFamily: KOREAN_FONT,
            fontWeight: 800,
            fontSize: { xs: "1.75rem", sm: "2.125rem" },
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
          }}
        >
          한국어 연습
        </Typography>
        <Typography
          sx={{
            fontFamily: KHMER_FONT,
            fontWeight: 600,
            fontSize: { xs: "1.05rem", sm: "1.15rem" },
            color: isDark ? "#fde68a" : "#b45309",
          }}
        >
          ការហាត់ភាសាកូរ៉េ
        </Typography>
        <Typography
          variant="body1"
          sx={{
            pt: 0.5,
            lineHeight: 1.6,
            color: isDark ? "#93c5fd" : "#1d4ed8",
            fontWeight: 500,
            fontSize: { xs: "0.95rem", sm: "1rem" },
          }}
        >
          Vocabulary, grammar, and daily dialogues — Korean, English, and Khmer.
        </Typography>
      </Stack>
    </Box>
  );
}
