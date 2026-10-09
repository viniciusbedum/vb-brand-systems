import type { Frontmatter } from "@/lib/content";
import { formatDate } from "@/lib/utils";

type ContentAreaProps = {
  frontmatter: Frontmatter;
  children: React.ReactNode;
};

export function ContentArea({ frontmatter, children }: ContentAreaProps) {
  return (
    <main className="flex-1 overflow-y-auto bg-background" id="content" role="main">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16">
        <header className="space-y-3 pb-8 border-b border-border">
          {frontmatter.section && (
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-link">
              {frontmatter.section}
            </p>
          )}
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {frontmatter.title}
          </h1>
          {frontmatter.description && (
            <p className="text-base text-muted-foreground">{frontmatter.description}</p>
          )}
        </header>

        <article className="prose dark:prose-invert max-w-none pt-8 [&>:first-child]:mt-0">{children}</article>

        {frontmatter.lastUpdated && (
          <footer className="mt-16 pt-6 border-t border-border text-xs text-muted-foreground">
            Atualizado em {formatDate(frontmatter.lastUpdated)}
          </footer>
        )}
      </div>
    </main>
  );
}
