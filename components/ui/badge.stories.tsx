import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { children: "Badge" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} variant="default">default</Badge>
      <Badge {...args} variant="secondary">secondary</Badge>
      <Badge {...args} variant="outline">outline</Badge>
      <Badge {...args} variant="destructive">destructive</Badge>
    </div>
  ),
};
