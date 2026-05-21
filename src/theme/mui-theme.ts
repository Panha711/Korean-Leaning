"use client";

import { createTheme, type Theme } from "@mui/material/styles";

const primaryMain = "#7c3aed";
const primaryLight = "#a78bfa";
const primaryDark = "#6d28d9";

export function createAppTheme(mode: "light" | "dark"): Theme {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: primaryLight,
        dark: primaryDark,
        contrastText: "#ffffff",
      },
      secondary: {
        main: mode === "light" ? "#f1f5f9" : "#334155",
        contrastText: mode === "light" ? "#0f172a" : "#f8fafc",
      },
      background: {
        default: mode === "light" ? "#f8fafc" : "#0b1120",
        paper: mode === "light" ? "#ffffff" : "#111827",
      },
      error: {
        main: "#ef4444",
      },
    },
    zIndex: {
      modal: 1300,
      snackbar: 1400,
      tooltip: 1500,
    },
    shape: {
      borderRadius: 10,
    },
    typography: {
      fontFamily: 'var(--font-geist-sans), "Roboto", "Helvetica", "Arial", sans-serif',
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            border: "none",
            boxShadow:
              mode === "light"
                ? "0 1px 2px rgb(0 0 0 / 0.05)"
                : "0 1px 2px rgb(0 0 0 / 0.25)",
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
          outlined: {
            borderWidth: 1,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
          size: "small",
        },
      },
      MuiPopover: {
        defaultProps: {
          disableScrollLock: true,
        },
        styleOverrides: {
          root: {
            zIndex: 1500,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundImage: "none",
          },
          list: {
            paddingTop: 4,
            paddingBottom: 4,
          },
        },
      },
    },
  });
}
