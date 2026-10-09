import type { Meta, StoryObj } from "@storybook/react";
import { TypographySample } from "./TypographySample";

const meta: Meta<typeof TypographySample> = {
  title: "MDX/TypographySample",
  component: TypographySample,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const InterSansSerif: Story = {
  args: {
    fontFamily: "Inter",
    weights: [400, 500, 600, 700],
    specimenText: "VB Brand Systems — sua marca, organizada.",
    usage: "Interface, corpo de texto",
  },
};

export const AllWeights: Story = {
  args: {
    fontFamily: "Inter",
    weights: [300, 400, 500, 600, 700, 800],
    specimenText: "A marca começa por dentro.",
  },
};

export const SingleWeight: Story = {
  args: {
    fontFamily: "Inter",
    weights: [400],
    specimenText: "Consistência é o modelo de negócio.",
  },
};

export const Monospace: Story = {
  args: {
    fontFamily: "monospace",
    weights: [400, 700],
    specimenText: "--color-brand-primary: #0F4C5C;",
    usage: "Código, tokens, valores técnicos",
  },
};
