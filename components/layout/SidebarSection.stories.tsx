import type { Meta, StoryObj } from "@storybook/react";
import { SidebarSection } from "./SidebarSection";

const meta: Meta<typeof SidebarSection> = {
  title: "Layout/SidebarSection",
  component: SidebarSection,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const coresSection = {
  title: "Cores",
  defaultOpen: true,
  items: [
    { title: "Paleta primária", slug: "cores/paleta-primaria" },
    { title: "Paleta secundária", slug: "cores/paleta-secundaria" },
    { title: "Uso de cores", slug: "cores/uso-de-cores" },
  ],
};

export const Closed: Story = {
  args: {
    section: { ...coresSection, defaultOpen: false },
    currentSlug: "",
  },
};

export const Open: Story = {
  args: {
    section: coresSection,
    currentSlug: "",
  },
};

export const WithActiveItem: Story = {
  args: {
    section: coresSection,
    currentSlug: "cores/paleta-primaria",
  },
};
