"use client";

import { useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { useTheme } from "@/components/providers/theme-provider";
import { createAppTheme } from "@/theme/mui-theme";

export function MuiAppProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const theme = useMemo(
    () => createAppTheme(resolvedTheme),
    [resolvedTheme]
  );

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
