import type { Theme } from "@mui/material/styles";

const EASY_READ_SIZES = {
  korean: "1.125rem",
  english: "1.0625rem",
  khmer: "1.0625rem",
  koreanWeight: 600,
} as const;

/** Large text with high-contrast English (blue) and Khmer (gold) colors. */
export function getEasyReadLineStyles(theme: Theme) {
  const isDark = theme.palette.mode === "dark";

  const englishColor = isDark ? "#93c5fd" : "#1d4ed8";
  const khmerColor = isDark ? "#fde68a" : "#b45309";

  return {
    korean: {
      fontWeight: EASY_READ_SIZES.koreanWeight,
      fontSize: EASY_READ_SIZES.korean,
      lineHeight: 1.45,
    },
    english: {
      fontSize: EASY_READ_SIZES.english,
      lineHeight: 1.5,
      color: englishColor,
      fontWeight: 500,
    },
    khmer: {
      fontSize: EASY_READ_SIZES.khmer,
      lineHeight: 1.55,
      color: khmerColor,
      fontWeight: 500,
    },
  };
}
