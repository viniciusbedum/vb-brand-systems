import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "@storybook/test";
import { SignOut as LogOut, Pencil, Gear as Settings, Trash as Trash2, User } from "@/lib/icons";
import { buttonVariants } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type DemoProps = {
  align?: "start" | "end";
  side?: "top" | "bottom";
  onSelect?: (item: string) => void;
};

function DropdownDemo({ align, side, onSelect = () => {} }: DemoProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
        <User />
        Conta
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side}>
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => onSelect("perfil")}>
          <User />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect("configuracoes")}>
          <Settings />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect("renomear")} disabled>
          <Pencil />
          Renomear
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={() => onSelect("excluir")}>
          <Trash2 />
          Excluir conversa
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => onSelect("sair")}>
          <LogOut />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const meta: Meta<typeof DropdownDemo> = {
  title: "UI/DropdownMenu",
  component: DropdownDemo,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: { onSelect: fn() },
  decorators: [
    (Story) => (
      <div className="flex min-h-80 items-center justify-center p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Conta" });

    trigger.focus();
    await userEvent.keyboard("{Enter}");
    const menu = await canvas.findByRole("menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    const items = within(menu).getAllByRole("menuitem");
    await waitFor(() => expect(items[0]).toHaveFocus());

    await userEvent.keyboard("{ArrowDown}");
    await expect(items[1]).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("menu")).toBeNull());
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};

export const SelectItem: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Conta" });

    await userEvent.click(trigger);
    await userEvent.click(await canvas.findByRole("menuitem", { name: "Configurações" }));
    await expect(args.onSelect).toHaveBeenCalledWith("configuracoes");
    await waitFor(() => expect(canvas.queryByRole("menu")).toBeNull());
  },
};

export const AlignEnd: Story = { args: { align: "end" } };
export const SideTop: Story = { args: { side: "top" } };
