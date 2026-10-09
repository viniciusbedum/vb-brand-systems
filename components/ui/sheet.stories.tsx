import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { Button } from "./button";
import { Sheet } from "./sheet";

function SheetDemo({ side }: { side?: "left" | "right" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Abrir menu
      </Button>
      <Sheet open={open} onOpenChange={setOpen} side={side} title="Navegação">
        <nav className="flex flex-col gap-1 px-4 pb-4">
          {["Visão geral", "Cores", "Tipografia", "Voz"].map((item) => (
            <Button key={item} variant="ghost" className="justify-start">
              {item}
            </Button>
          ))}
        </nav>
      </Sheet>
    </>
  );
}

const meta: Meta<typeof SheetDemo> = {
  title: "UI/Sheet",
  component: SheetDemo,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Left: Story = {
  args: { side: "left" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Abrir menu" });

    await userEvent.click(opener);
    const sheet = await canvas.findByRole("dialog", { name: "Navegação" });
    await expect(sheet).toBeVisible();

    await userEvent.click(within(sheet).getByRole("button", { name: "Fechar" }));
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(opener).toHaveFocus());
  },
};

export const Right: Story = { args: { side: "right" } };
