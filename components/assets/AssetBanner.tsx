import { useTranslations } from "next-intl";
import type { AssetCategory } from "@/lib/asset-config";
import { Card } from "@/components/ui/card";

type AssetBannerProps = {
  category: AssetCategory;
};

export function AssetBanner({ category }: AssetBannerProps) {
  const t = useTranslations("assets");
  return (
    <Card className="bg-gradient-to-br from-primary/20 via-card to-card px-6 py-8 sm:px-8 sm:py-10">
      <p className="text-[11px] uppercase tracking-[0.16em] text-link">{t("brandAssets")}</p>
      <h1 className="mt-2 font-heading text-[26px] md:text-[32px] leading-[1.15] font-semibold tracking-tight">{category.label}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">{category.description}</p>
    </Card>
  );
}
