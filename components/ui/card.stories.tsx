import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta: Meta<typeof Card> = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Título do cartão</CardTitle>
        <CardDescription>Descrição curta do conteúdo.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Conteúdo principal.</p>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-muted-foreground">Rodapé</span>
      </CardFooter>
    </Card>
  ),
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Interactive: Story = { args: { interactive: true } };
export const Glass: Story = {
  args: { glass: true },
  decorators: [
    (Story) => (
      <div className="page-backdrop p-8">
        <Story />
      </div>
    ),
  ],
};
