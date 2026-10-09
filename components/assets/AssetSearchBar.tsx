"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type AssetSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function AssetSearchBar({ value, onChange, placeholder = "Buscar ativos…" }: AssetSearchBarProps) {
  return (
    <div className="relative flex-1">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar ativos"
        className="pl-9"
      />
    </div>
  );
}
