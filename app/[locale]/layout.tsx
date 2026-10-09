import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { brand, brandCopy } from "@/brand/config";
import { sansFont, headingFont } from "@/brand/fonts";
import { routing } from "@/i18n/routing";
import "../globals.css";
import "@/brand/theme.css";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

const HTML_LANG = { en: "en", pt: "pt-BR" } as const;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  return {
    title: {
      template: `%s | ${brand.name}`,
      default: brand.name,
    },
    description: brandCopy[locale].description,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={HTML_LANG[locale]} suppressHydrationWarning>
      <body className={`${sansFont.variable} ${headingFont.variable}`}>
        <NextIntlClientProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
