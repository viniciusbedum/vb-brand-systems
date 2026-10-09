import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";

export default function DocLoading() {
  const t = useTranslations("docs");
  const widths = ["w-full", "w-11/12", "w-10/12", "w-full", "w-9/12", "w-11/12", "w-8/12", "w-10/12"];
  return (
    <div data-backdrop="docs" className="flex-1 overflow-y-auto" aria-busy="true" aria-label={t("loading")}>
      <div className="mx-auto max-w-[680px] px-5 sm:px-6 pt-8 md:pt-12 pb-16">
        <div className="space-y-3 pb-8 border-b border-border">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>
        <div className="space-y-3 pt-8">
          {widths.map((w, i) => (
            <Skeleton key={i} className={`h-4 ${w}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
