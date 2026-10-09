"use client";

import { useTranslations } from "next-intl";
import { ArrowLineLeft } from "@/lib/icons";
import { useSidebar } from "@/lib/sidebar-context";
import { Button } from "@/components/ui/button";

export function SidebarToggleButton() {
  const t = useTranslations("shell");
  const { toggle } = useSidebar();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggle}
      className="ml-auto hidden md:inline-flex text-muted-foreground"
      aria-label={t("collapse")}
    >
      <ArrowLineLeft aria-hidden="true" />
    </Button>
  );
}
