import type { Meta, StoryObj } from "@storybook/react";
import { ContentArea } from "./ContentArea";

const meta: Meta<typeof ContentArea> = {
  title: "Layout/ContentArea",
  component: ContentArea,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex h-screen flex-1">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultFrontmatter = {
  title: "Paleta Primária",
  description: "As cores principais da marca VB Brand Systems e seus valores de uso.",
  section: "Cores",
  order: 1,
  lastUpdated: "2026-05-16",
};

export const Default: Story = {
  args: {
    frontmatter: defaultFrontmatter,
    children: (
      <div>
        <p>Este é um exemplo de conteúdo MDX renderizado na área de conteúdo do brand system.</p>
        <p>O sistema de cores da marca VB Brand Systems é composto por uma paleta primária de destaque e neutros de suporte.</p>
        <h2>Seção de exemplo</h2>
        <p>Cada cor tem um propósito específico e um token CSS associado.</p>
      </div>
    ),
  },
};

export const WithoutSection: Story = {
  args: {
    frontmatter: {
      title: "Bem-vindo ao Brand System",
      description: "A fonte única de verdade para todas as diretrizes da marca.",
    },
    children: <p>Conteúdo da página de introdução.</p>,
  },
};

export const WithoutLastUpdated: Story = {
  args: {
    frontmatter: {
      title: "Motion Design",
      description: "Princípios de animação da marca.",
      section: "Motion",
    },
    children: <p>Conteúdo sobre motion design.</p>,
  },
};

export const LongContent: Story = {
  args: {
    frontmatter: defaultFrontmatter,
    children: (
      <div>
        {Array.from({ length: 10 }).map((_, i) => (
          <p key={i}>
            Parágrafo {i + 1}: O sistema de cores foi desenvolvido para garantir consistência em todas as
            aplicações da marca, desde redes sociais até materiais impressos.
          </p>
        ))}
      </div>
    ),
  },
};
