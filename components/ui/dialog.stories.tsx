import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "@storybook/test";
import { Button } from "./button";
import { Dialog } from "./dialog";

function DialogDemo({
  size,
  defaultOpen = false,
}: {
  size?: "sm" | "md" | "lg";
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir diálogo</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Configurações"
        description="Ajuste as preferências da sua conta."
        size={size}
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pressione Esc, clique fora ou use o botão fechar para sair.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>Salvar</Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

const meta: Meta<typeof DialogDemo> = {
  title: "UI/Dialog",
  component: DialogDemo,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", { name: "Abrir diálogo" });

    await userEvent.click(opener);
    const dialog = await canvas.findByRole("dialog", { name: "Configurações" });
    await expect(dialog).toBeVisible();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(opener).toHaveFocus());
  },
};

export const Small: Story = { args: { size: "sm" } };
export const Large: Story = { args: { size: "lg" } };

/** Monta já aberto: não pode se fechar sozinho (evento `close` atrasado do StrictMode). */
export const OpenOnMount: Story = {
  args: { defaultOpen: true },
  parameters: { react: { strictMode: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dialog = await canvas.findByRole("dialog", { name: "Configurações" });
    await new Promise((resolve) => setTimeout(resolve, 150));
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("open");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("dialog")).toBeNull());
  },
};
