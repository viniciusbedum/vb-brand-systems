"use client";

import { useTranslations } from "next-intl";
import { MagnifyingGlass as Search } from "@/lib/icons";
import { Input } from "@/components/ui/input";

type AssetSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function AssetSearchBar({ value, onChange, placeholder }: AssetSearchBarProps) {
  const t = useTranslations("assets");
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
        placeholder={placeholder ?? t("searchDefault")}
        aria-label={t("searchLabel")}
        className="pl-9"
      />
    </div>
  );
}
