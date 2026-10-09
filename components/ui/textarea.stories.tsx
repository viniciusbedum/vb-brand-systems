import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { placeholder: "Escreva sua mensagem", "aria-label": "Mensagem" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AutoResize: Story = { args: { autoResize: true, maxHeight: 160 } };
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { "aria-invalid": true } };
