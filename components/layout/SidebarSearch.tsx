"use client";

import { MagnifyingGlass as Search } from "@/lib/icons";
import { Input } from "@/components/ui/input";

export function SidebarSearch() {
  return (
    <div className="relative mb-4">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        aria-label="Buscar"
        placeholder="Buscar…"
        className="h-9 pl-9"
      />
    </div>
  );
}
