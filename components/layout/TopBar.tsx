"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { GitBranch } from "@/lib/icons";
import { brand } from "@/brand/config";
import { isDemoMode } from "@/lib/features";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/ui/LanguageSwitch";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function TopBar() {
  const t = useTranslations("shell");
  return (
    <div className="hidden md:flex justify-end px-4 sm:px-6 lg:px-8 pt-4">
      <div className="glass rounded-xl h-12 px-2 flex items-center gap-1">
        {isDemoMode && (
          <Badge variant="outline" className="mx-1">
            {t("demoBadge")}
          </Badge>
        )}
        <ThemeToggle />
        <LanguageSwitch className="px-1" />
        {brand.links.github && (
          <Link
            href={brand.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label={t("github")}
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          >
            <GitBranch aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
