import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { brand } from "@/brand/config";
import { sansFont, headingFont } from "@/brand/fonts";
import "./globals.css";
import "@/brand/theme.css";

export const metadata: Metadata = {
  title: {
    template: `%s | ${brand.name}`,
    default: brand.name,
  },
  description: brand.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={brand.locale} suppressHydrationWarning>
      <body className={`${sansFont.variable} ${headingFont.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
