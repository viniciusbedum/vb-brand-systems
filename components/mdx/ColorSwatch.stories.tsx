import type { Meta, StoryObj } from "@storybook/react";
import { ColorSwatch } from "./ColorSwatch";

const meta: Meta<typeof ColorSwatch> = {
  title: "MDX/ColorSwatch",
  component: ColorSwatch,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="max-w-60">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    name: "Petróleo",
    hex: "#0F4C5C",
    rgb: "15, 76, 92",
    token: "--color-brand-primary",
    usage: "CTAs, destaques, links",
  },
};

export const Dark: Story = {
  args: {
    name: "Preto Profundo",
    hex: "#0D0D0D",
    rgb: "13, 13, 13",
    token: "--color-neutral-900",
    usage: "Backgrounds dark mode",
  },
};

export const Minimal: Story = {
  args: {
    name: "Branco",
    hex: "#FFFFFF",
  },
};
