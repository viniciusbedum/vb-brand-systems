import Link from "next/link";
import { GitBranch } from "@/lib/icons";
import { brand } from "@/brand/config";
import { isDemoMode } from "@/lib/features";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function TopBar() {
  return (
    <div className="hidden md:flex justify-end px-4 sm:px-6 lg:px-8 pt-4">
      <div className="glass rounded-xl h-12 px-2 flex items-center gap-1">
        {isDemoMode && (
          <Badge variant="outline" className="mx-1">
            Demo
          </Badge>
        )}
        <ThemeToggle />
        {brand.links.github && (
          <Link
            href={brand.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Ver no GitHub"
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
          >
            <GitBranch aria-hidden="true" />
          </Link>
        )}
      </div>
    </div>
  );
}
