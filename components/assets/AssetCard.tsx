"use client";

import { useTranslations } from "next-intl";
import { X, DownloadSimple as Download, FileText, MusicNotes as Music, VideoCamera as Video, Image, File } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";

export type AssetFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  storage_path: string;
  category: string;
  uploaded_by: string | null;
  created_at: string;
};

type AssetCardProps = {
  asset: AssetFile;
  onDelete: (id: string, storagePath: string) => void;
  isAdmin: boolean;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("video/")) return Video;
  if (type.startsWith("audio/")) return Music;
  if (type === "application/pdf" || type.includes("document")) return FileText;
  return File;
}

export function AssetCard({ asset, onDelete, isAdmin }: AssetCardProps) {
  const t = useTranslations("assets");
  const isImage = asset.type.startsWith("image/");
  const Icon = getFileIcon(asset.type);
  const extension = asset.name.split(".").pop() ?? "";

  return (
    <Card className="group relative overflow-hidden rounded-2xl transition-colors hover:border-link/40 focus-within:border-link/40">
      <div
        className={cn(
          "relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-border",
          isImage
            ? "bg-[length:16px_16px] bg-[conic-gradient(hsl(var(--canvas-muted))_25%,hsl(var(--canvas))_0_50%,hsl(var(--canvas-muted))_0_75%,hsl(var(--canvas))_0)]"
            : "bg-muted"
        )}
      >
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.url}
            alt={asset.name}
            className={cn(
              "h-full w-full",
              asset.type === "image/svg+xml" ? "object-contain p-6" : "object-cover"
            )}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Icon size={32} aria-hidden="true" />
            <Badge variant="secondary" className="font-mono uppercase">
              {extension}
            </Badge>
          </div>
        )}

        <div className="absolute right-2 top-2 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
          <a
            href={asset.url}
            download={asset.name}
            className={buttonVariants({ variant: "secondary", size: "icon-sm" })}
            aria-label={t("download", { name: asset.name })}
          >
            <Download aria-hidden="true" />
          </a>
          {isAdmin && (
            <Button
              variant="destructive"
              size="icon-sm"
              onClick={() => onDelete(asset.id, asset.storage_path)}
              aria-label={t("remove", { name: asset.name })}
            >
              <X aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="truncate text-sm font-medium" title={asset.name}>
          {asset.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{formatBytes(asset.size)}</p>
      </div>
    </Card>
  );
}
