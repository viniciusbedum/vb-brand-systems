import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/locale-href";
import { getNavigationIcon } from "@/lib/icons";
import { HomeChat } from "@/components/ai/HomeChat";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { brand, brandCopy } from "@/brand/config";
import { getNavConfig } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { isAIVisible } from "@/lib/features";


type BrandSystemHomeProps = {
  showHeader?: boolean;
};

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export async function BrandSystemHome({ showHeader = true }: BrandSystemHomeProps) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("shell");
  const copy = brandCopy[locale];
  const CARDS = getNavConfig(locale).map((section) => ({
    title: section.title,
    pages: section.items.length,
    href: section.href ?? (section.items[0] ? `/docs/${section.items[0].slug}` : null),
    icon: getNavigationIcon(section.icon),
  }));

  return (
    <main id="content" data-backdrop className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-16 pb-16 space-y-10">
        {showHeader && (
          <header className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.16em] text-link">{copy.tagline}</p>
            <h1 className="font-heading text-[28px] md:text-4xl leading-[1.15] font-semibold tracking-tight">
              {brand.name}
            </h1>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-xl">{copy.description}</p>
          </header>
        )}

        {isAIVisible && <HomeChat />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card) => {
            const CardIcon = card.icon;
            const available = card.href && card.pages > 0;
            const inner = (
              <div className="flex items-center gap-4 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-link">
                  <CardIcon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{card.title}</p>
                  {available ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {t("pageCount", { count: card.pages })}
                    </p>
                  ) : (
                    <Badge variant="secondary" className="mt-1">
                      {t("soon")}
                    </Badge>
                  )}
                </div>
              </div>
            );

            if (available) {
              return (
                <Link
                  key={card.title}
                  href={card.href!}
                  className={cn("block rounded-xl", focusRing)}
                >
                  <Card interactive>{inner}</Card>
                </Link>
              );
            }

            return (
              <Card key={card.title} className="opacity-60 cursor-default">
                {inner}
              </Card>
            );
          })}
        </div>
      </div>
    </main>
  );
}
