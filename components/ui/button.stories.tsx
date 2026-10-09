import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "@/lib/icons";
import { Button } from "./button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { children: "Botão" },
};

export default meta;
type Story = StoryObj<typeof meta>;

const variants = ["default", "secondary", "outline", "ghost", "destructive", "link"] as const;

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((v) => (
        <Button key={v} {...args} variant={v}>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} size="sm">Pequeno</Button>
      <Button {...args} size="md">Médio</Button>
      <Button {...args} size="lg">Grande</Button>
      <Button {...args} size="icon" aria-label="Adicionar"><Plus /></Button>
      <Button {...args} size="icon-sm" aria-label="Adicionar"><Plus /></Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {variants.map((v) => (
        <Button key={v} {...args} variant={v} disabled>
          {v}
        </Button>
      ))}
    </div>
  ),
};

export const LinkSizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} variant="link" size="sm">Link pequeno</Button>
      <Button {...args} variant="link" size="md">Link médio</Button>
      <Button {...args} variant="link" size="lg">Link grande</Button>
    </div>
  ),
};
