"use client";

import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { NavigationProgress } from "./NavigationProgress";
import { Sidebar } from "./Sidebar";
import { ThemeToggle } from "./ThemeToggle";

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/vocabulary": "Words",
  "/grammar": "Grammar",
  "/daily-sentences": "Daily Sentences",
  "/quiz": "Quizzes",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const pageTitle =
    title ??
    pageTitles[pathname] ??
    (pathname.startsWith("/courses/")
      ? "Course"
      : pathname.startsWith("/lessons/")
        ? "Lesson"
        : "한국어 연습");

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar />
      <Box
        sx={{ display: "flex", flex: 1, flexDirection: "column", minWidth: 0 }}
      >
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Toolbar sx={{ minHeight: 56, px: { xs: 2, sm: 3 } }}>
            <Typography
              variant="h6"
              sx={{
                flex: 1,
                pl: { xs: 7, lg: 0 },
                fontWeight: 700,
                fontSize: { xs: "1.125rem", sm: "1.25rem" },
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
              noWrap
            >
              {pageTitle}
            </Typography>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ flex: 1, overflowY: "auto" }}>
          <NavigationProgress />
          <Container maxWidth="xl" sx={{ py: { xs: 1.25, sm: 3 } }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
