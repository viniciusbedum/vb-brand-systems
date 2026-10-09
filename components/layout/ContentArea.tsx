import { getLocale, getTranslations } from "next-intl/server";
import type { Frontmatter } from "@/lib/content";
import { formatDate } from "@/lib/utils";

type ContentAreaProps = {
  frontmatter: Frontmatter;
  children: React.ReactNode;
};

export async function ContentArea({ frontmatter, children }: ContentAreaProps) {
  const locale = await getLocale();
  const t = await getTranslations("docs");
  return (
    <main data-backdrop="docs" className="flex-1 overflow-y-auto" id="content" role="main">
      <div className="mx-auto max-w-[680px] px-5 sm:px-6 pt-8 md:pt-12 pb-16">
        <header className="space-y-2.5 pb-6 border-b border-border">
          {frontmatter.section && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-link">
              {frontmatter.section}
            </p>
          )}
          <h1 className="font-heading text-[26px] md:text-[32px] leading-[1.15] font-semibold tracking-tight text-foreground">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="text-[15px] leading-relaxed text-muted-foreground">{frontmatter.description}</p>
          )}
        </header>

        <article className="prose dark:prose-invert max-w-none pt-6 [&>:first-child]:mt-0">{children}</article>

        {frontmatter.lastUpdated && (
          <footer className="mt-16 pt-6 border-t border-border text-xs text-muted-foreground">
            {t("updatedOn", { date: formatDate(frontmatter.lastUpdated, locale) })}
          </footer>
        )}
      </div>
    </main>
  );
}
