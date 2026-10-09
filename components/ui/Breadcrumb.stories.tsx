import type { Meta, StoryObj } from "@storybook/react";
import { Breadcrumb } from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleItem: Story = {
  args: {
    items: [{ label: "Introdução" }],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: "Cores" },
      { label: "Paleta Primária" },
    ],
  },
};

export const ThreeLevels: Story = {
  args: {
    items: [
      { label: "Brand System", href: "/" },
      { label: "Identidade Visual" },
      { label: "Logo" },
    ],
  },
};
