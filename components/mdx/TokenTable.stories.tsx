import type { Meta, StoryObj } from "@storybook/react";
import { TokenTable } from "./TokenTable";

const meta: Meta<typeof TokenTable> = {
  title: "MDX/TokenTable",
  component: TokenTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ColorTokens: Story = {
  args: {
    tokens: [
      { name: "--color-brand-primary", value: "#0F4C5C", description: "Cor primária — CTAs e destaques" },
      { name: "--color-neutral-900", value: "#0D0D0D", description: "Background dark mode" },
      { name: "--color-neutral-0", value: "#FFFFFF", description: "Background light mode" },
      { name: "--color-neutral-500", value: "#737373", description: "Textos secundários" },
    ],
  },
};

export const TypographyTokens: Story = {
  args: {
    tokens: [
      { name: "--font-sans", value: "Inter, system-ui", description: "Fonte principal da interface" },
      { name: "--font-mono", value: "JetBrains Mono", description: "Código e valores técnicos" },
      { name: "--text-base", value: "16px / 1rem", description: "Corpo de texto padrão" },
      { name: "--text-xl", value: "20px / 1.25rem", description: "H3" },
      { name: "--text-2xl", value: "24px / 1.5rem", description: "H2" },
      { name: "--text-4xl", value: "36px / 2.25rem", description: "H1" },
    ],
  },
};

export const SpacingTokens: Story = {
  args: {
    tokens: [
      { name: "--spacing-1", value: "4px", description: "Micro espaçamento" },
      { name: "--spacing-2", value: "8px", description: "Espaçamento interno mínimo" },
      { name: "--spacing-4", value: "16px", description: "Espaçamento padrão" },
      { name: "--spacing-6", value: "24px", description: "Espaçamento médio" },
      { name: "--spacing-8", value: "32px", description: "Espaçamento entre seções" },
      { name: "--radius", value: "0.5rem", description: "Border radius padrão" },
    ],
  },
};

export const WithoutDescriptions: Story = {
  args: {
    tokens: [
      { name: "--color-primary", value: "hsl(22 100% 57%)" },
      { name: "--color-background", value: "hsl(0 0% 100%)" },
      { name: "--color-foreground", value: "hsl(0 0% 9%)" },
    ],
  },
};

export const LongTokens: Story = {
  args: {
    tokens: [
      { name: "--color-brand-primary-surface-elevated-hover", value: "hsl(193 72% 21% / 0.85)", description: "Token longo para validar rolagem horizontal em telas estreitas" },
      { name: "--color-brand-secondary-border-subtle", value: "hsl(193 20% 80%)" },
    ],
  },
};
