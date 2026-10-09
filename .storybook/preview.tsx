import type { Preview, Decorator } from "@storybook/react";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import en from "../messages/en.json";
import pt from "../messages/pt.json";
import "../app/globals.css";
import "../brand/theme.css";

const messages = { en, pt };

const withIntl: Decorator = (Story, context) => {
  const locale = (context.globals.locale ?? "en") as "en" | "pt";
  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      <Story />
    </NextIntlClientProvider>
  );
};

const withThemeProvider: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "light";
  return (
    <ThemeProvider attribute="class" defaultTheme={theme} forcedTheme={theme}>
      <div className={`${theme} bg-background text-foreground min-h-screen`}>
        <Story />
      </div>
    </ThemeProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    locale: {
      description: "Idioma",
      defaultValue: "en",
      toolbar: {
        title: "Idioma",
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "pt", title: "Português" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: "Tema global",
      defaultValue: "light",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withIntl, withThemeProvider],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    nextjs: {
      appDirectory: true,
    },
  },
};

export default preview;
