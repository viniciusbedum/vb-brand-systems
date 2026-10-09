import type { Meta, StoryObj } from "@storybook/react";
import { Field } from "./field";
import { Input } from "./input";

const meta: Meta<typeof Field> = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "E-mail", htmlFor: "email", children: <Input type="email" /> },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithHint: Story = { args: { hint: "Usaremos apenas para o login." } };
export const WithError: Story = { args: { error: "Informe um e-mail válido." } };
export const WithHintAndError: Story = {
  args: { hint: "Usaremos apenas para o login.", error: "Informe um e-mail válido." },
};
export const WithAction: Story = {
  args: {
    label: "Senha",
    htmlFor: "senha",
    action: <a href="#" className="text-sm text-link hover:underline">Esqueci minha senha</a>,
    children: <Input type="password" />,
  },
};
