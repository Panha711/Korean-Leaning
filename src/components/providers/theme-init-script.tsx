"use client";

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem('theme');
    var isDark =
      theme === 'dark' ||
      (theme !== 'light' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();
`;

/**
 * Injects theme class before paint. Rendered only during SSR — omitted on the
 * client to avoid React 19 "script tag while rendering" warnings.
 */
export function ThemeInitScript() {
  if (typeof window !== "undefined") {
    return null;
  }

  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  );
}
