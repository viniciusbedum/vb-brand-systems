import type { Meta, StoryObj } from "@storybook/react";
import { SidebarItem } from "./SidebarItem";

const meta: Meta<typeof SidebarItem> = {
  title: "Layout/SidebarItem",
  component: SidebarItem,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: { title: "Paleta Primária", slug: "cores/paleta-primaria" },
    isActive: false,
  },
};

export const Active: Story = {
  args: {
    item: { title: "Paleta Primária", slug: "cores/paleta-primaria" },
    isActive: true,
  },
};

export const LongTitle: Story = {
  args: {
    item: { title: "Princípios de Animação e Motion Design", slug: "motion/principios-animacao" },
    isActive: false,
  },
};
