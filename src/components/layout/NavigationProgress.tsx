"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

function isInternalNavigation(anchor: HTMLAnchorElement, pathname: string) {
  const href = anchor.getAttribute("href");
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;
    const nextPath = url.pathname + url.search;
    const currentPath = pathname + window.location.search;
    return nextPath !== currentPath;
  } catch {
    return false;
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element).closest("a");
      if (!anchor || !isInternalNavigation(anchor, pathname)) return;
      setIsLoading(true);
    };

    const onPopState = () => setIsLoading(true);

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 2,
      }}
    >
      <LinearProgress color="primary" />
    </Box>
  );
}
