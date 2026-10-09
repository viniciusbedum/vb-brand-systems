import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  decorators: [
    (Story) => (
      <div className="space-y-4">
        <p className="text-sm text-foreground">Conteúdo acima</p>
        <Story />
        <p className="text-sm text-foreground">Conteúdo abaixo</p>
      </div>
    ),
  ],
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  decorators: [
    (Story) => (
      <div className="flex items-center gap-4 h-8">
        <span className="text-sm">Esquerda</span>
        <Story />
        <span className="text-sm">Direita</span>
      </div>
    ),
  ],
};
