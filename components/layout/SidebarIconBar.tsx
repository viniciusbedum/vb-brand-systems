"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Folder, FileText, ChatCircle as MessageCircle, House, Plus } from "@/lib/icons";
import { isAIVisible } from "@/lib/features";
import { getAllNavSlugs } from "@/lib/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PreferencesMenu } from "./PreferencesMenu";

const firstDocSlug = getAllNavSlugs()[0];
const firstDocHref = firstDocSlug ? `/docs/${firstDocSlug}` : "/";

export function SidebarIconBar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("shell");

  const isActive = (pattern: string) => {
    if (pattern === "/") return pathname === "/" || pathname.startsWith("/chat");
    return pathname.startsWith(pattern);
  };

  const iconClass = (pattern: string) =>
    cn(
      buttonVariants({ variant: "ghost", size: "icon-sm" }),
      !mobile && "h-11 w-11 [&_svg]:size-6",
      mobile && "h-12 w-[4.5rem] flex-col gap-1 rounded-xl [&_svg]:size-6 text-xs",
      isActive(pattern) ? "bg-primary/15 text-link" : "text-muted-foreground"
    );

  const homeLabel = isAIVisible ? t("chatWithAI") : t("home");
  const scrollToTop = () => {
    if (mobile) window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <div className={cn("flex items-center gap-1", mobile ? "glass h-16 rounded-2xl px-2" : "mb-4")}>
      <Link
        href="/assets"
        onClick={scrollToTop}
        title={t("assetsTitle")}
        aria-label={t("assetsTitle")}
        aria-current={isActive("/assets") ? "page" : undefined}
        className={iconClass("/assets")}
      >
        <Folder aria-hidden="true" />
        {mobile && <span>{t("assets")}</span>}
      </Link>
      <Link
        href={firstDocHref}
        onClick={scrollToTop}
        title={t("content")}
        aria-label={t("content")}
        aria-current={isActive("/docs") ? "page" : undefined}
        className={iconClass("/docs")}
      >
        <FileText aria-hidden="true" />
        {mobile && <span>{t("content")}</span>}
      </Link>
      <Link
        href="/"
        onClick={scrollToTop}
        title={homeLabel}
        aria-label={homeLabel}
        aria-current={isActive("/") ? "page" : undefined}
        className={iconClass("/")}
      >
        {isAIVisible ? <MessageCircle aria-hidden="true" /> : <House aria-hidden="true" />}
        {mobile && <span>{isAIVisible ? t("chat") : t("home")}</span>}
      </Link>
      {mobile && (
        <PreferencesMenu className="h-12 w-[4.5rem] flex-col gap-1 rounded-xl text-xs text-muted-foreground [&_svg]:size-6" />
      )}
      {isAIVisible && !mobile && (
        <Link
          href="/chat"
          title={t("newConversation")}
          aria-label={t("newConversation")}
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon-sm" }),
            "ml-auto h-11 w-11 text-link [&_svg]:size-6"
          )}
        >
          <Plus aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
