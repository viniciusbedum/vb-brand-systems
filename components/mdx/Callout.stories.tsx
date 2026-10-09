import type { Meta, StoryObj } from "@storybook/react";
import { Callout } from "./Callout";

const meta: Meta<typeof Callout> = {
  title: "MDX/Callout",
  component: Callout,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    type: "info",
    title: "Informação",
    children: "Use sempre o logo com espaçamento mínimo de 24px em todos os lados.",
  },
};

export const Warning: Story = {
  args: {
    type: "warning",
    title: "Atenção",
    children: "Nunca use o logo sobre fundos que comprometam a legibilidade.",
  },
};

export const Tip: Story = {
  args: {
    type: "tip",
    title: "Dica",
    children: "Para posts de Instagram, prefira a versão símbolo do logo para avatares.",
  },
};

export const Danger: Story = {
  args: {
    type: "danger",
    title: "Proibido",
    children: "Nunca distorça, rotacione ou altere as cores do logotipo.",
  },
};

export const WithoutTitle: Story = {
  args: {
    type: "info",
    children: "Callout sem título — usado para notas rápidas no conteúdo.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Callout type="info" title="Info">Mensagem informativa.</Callout>
      <Callout type="warning" title="Warning">Mensagem de atenção.</Callout>
      <Callout type="tip" title="Tip">Mensagem de dica.</Callout>
      <Callout type="danger" title="Danger">Mensagem de perigo.</Callout>
    </div>
  ),
};
