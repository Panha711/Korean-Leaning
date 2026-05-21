import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Khmer, Noto_Sans_KR } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeInitScript } from "@/components/providers/theme-init-script";
import { MuiAppProvider } from "@/components/providers/mui-app-provider";
import { Toaster } from "@/components/providers/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoKhmer = Noto_Sans_Khmer({
  variable: "--font-noto-khmer",
  subsets: ["khmer"],
  weight: ["400", "500", "600", "700"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "한국어 연습 - Personal Korean Study",
  description:
    "Personal Korean learning app: Hangul, phrases, grammar, quizzes, and AI tutor. No login required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoKhmer.variable} ${notoSansKr.variable} min-h-screen font-sans antialiased`}
      >
        <ThemeInitScript />
        <ThemeProvider defaultTheme="system">
          <MuiAppProvider>
            {children}
            <Toaster />
          </MuiAppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
