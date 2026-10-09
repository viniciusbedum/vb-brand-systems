"use client";

import { PanelLeft } from "lucide-react";
import { useSidebar } from "@/lib/sidebar-context";
import { Button } from "@/components/ui/button";

export function SidebarToggleButton() {
  const { toggle } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      className="ml-auto hidden md:inline-flex text-muted-foreground"
      aria-label="Recolher sidebar"
    >
      <PanelLeft aria-hidden="true" />
    </Button>
  );
}
