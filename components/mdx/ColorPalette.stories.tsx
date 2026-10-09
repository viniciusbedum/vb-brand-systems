import type { Meta, StoryObj } from "@storybook/react";
import { ColorPalette } from "./ColorPalette";

const meta: Meta<typeof ColorPalette> = {
  title: "MDX/ColorPalette",
  component: ColorPalette,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const brandColors = [
  { name: "Petróleo", hex: "#0F4C5C", rgb: "15, 76, 92", token: "--color-brand-primary", usage: "CTAs, destaques" },
  { name: "Petróleo Escura", hex: "#0A3642", rgb: "10, 54, 66", token: "--color-brand-primary-dark", usage: "Hover" },
  { name: "Petróleo Clara", hex: "#5C9AA8", rgb: "92, 154, 168", token: "--color-brand-primary-light", usage: "Backgrounds sutis" },
];

const neutralColors = [
  { name: "Preto", hex: "#0D0D0D", token: "--color-neutral-900" },
  { name: "Cinza Escuro", hex: "#1A1A1A", token: "--color-neutral-800" },
  { name: "Cinza Médio", hex: "#737373", token: "--color-neutral-500" },
  { name: "Cinza Claro", hex: "#E5E5E5", token: "--color-neutral-200" },
  { name: "Branco", hex: "#FFFFFF", token: "--color-neutral-0" },
];

export const ThreeColumns: Story = {
  args: {
    colors: brandColors,
    columns: 3,
  },
};

export const TwoColumns: Story = {
  args: {
    colors: brandColors,
    columns: 2,
  },
};

export const FourColumns: Story = {
  args: {
    colors: [...brandColors, ...neutralColors.slice(0, 1)],
    columns: 4,
  },
};

export const NeutralPalette: Story = {
  args: {
    colors: neutralColors,
    columns: 4,
  },
};

export const MobileOverflowCheck: Story = {
  args: { colors: [...brandColors, ...neutralColors], columns: 4 },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
