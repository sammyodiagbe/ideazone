import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Idea Zone - Transform Ideas into Action",
  description: "Transform raw product ideas into structured, actionable documentation with AI",
};

// Script to prevent flash of wrong theme
const themeScript = `
  (function() {
    const saved = localStorage.getItem('ideazone_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (saved !== 'light' && prefersDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    }
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <ThemeProvider>
            <WorkspaceProvider>{children}</WorkspaceProvider>
          </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
