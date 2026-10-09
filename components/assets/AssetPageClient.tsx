"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import type { AssetCategory } from "@/lib/asset-config";
import { listAssets, uploadAsset, deleteAsset, type AssetRecord } from "@/lib/assets";
import { createClient } from "@/lib/supabase";
import { isDemoMode } from "@/lib/features";
import { listDemoAssets } from "@/lib/demo-assets";
import { AssetBanner } from "./AssetBanner";
import { AssetSearchBar } from "./AssetSearchBar";
import { UploadButton } from "./UploadButton";
import { AssetGrid } from "./AssetGrid";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import type { AssetFile } from "./AssetCard";

type AssetPageClientProps = {
  category: AssetCategory;
};

function toAssetFile(record: AssetRecord): AssetFile {
  return {
    id: record.id,
    name: record.name,
    size: record.size,
    type: record.type,
    url: record.url ?? "",
    storage_path: record.storage_path,
    category: record.category,
    uploaded_by: record.uploaded_by,
    created_at: record.created_at,
  };
}

export function AssetPageClient({ category }: AssetPageClientProps) {
  const t = useTranslations("assets");
  const tDemo = useTranslations("demo");
  const [assets, setAssets] = useState<AssetFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      if (isDemoMode) {
        setAssets(listDemoAssets(category.slug));
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setIsAdmin(profile?.role === "admin");

      try {
        const records = await listAssets(category.slug);
        setAssets(records.map(toAssetFile));
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [category.slug]);

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (isDemoMode) {
        setNotice(tDemo("uploadNotice"));
        return;
      }
      if (!userId) return;
      setUploading(true);
      try {
        const uploaded = await Promise.all(
          files.map((file) => uploadAsset(file, category.slug, userId))
        );
        setAssets((prev) => [...uploaded.map(toAssetFile), ...prev]);
      } finally {
        setUploading(false);
      }
    },
    [category.slug, userId, tDemo]
  );

  const handleDelete = useCallback(async (id: string, storagePath: string) => {
    await deleteAsset(id, storagePath);
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const filteredAssets = useMemo(() => {
    if (!search.trim()) return assets;
    return assets.filter((a) =>
      a.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [assets, search]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-16 pt-8 sm:px-6 md:pt-12 lg:px-8">
      <AssetBanner category={category} />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <AssetSearchBar
          value={search}
          onChange={setSearch}
          placeholder={t("searchIn", { category: category.label.toLowerCase() })}
        />
        <UploadButton
          accept={category.accept}
          onFiles={handleFiles}
          disabled={uploading || (!isDemoMode && !userId)}
          loading={uploading}
        />
      </div>

      {notice && (
        <p role="status" className="rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm">
          {notice}
        </p>
      )}

      {assets.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {filteredAssets.length === assets.length
              ? t("fileCount", { count: assets.length })
              : t("fileCountFiltered", { shown: filteredAssets.length, total: assets.length })}
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <EmptyState
          message={category.emptyMessage}
          extensions={category.extensions}
        />
      ) : filteredAssets.length === 0 ? (
        <EmptyState
          message={t("noResults", { search })}
          extensions={category.extensions}
        />
      ) : (
        <AssetGrid assets={filteredAssets} onDelete={handleDelete} isAdmin={isAdmin} />
      )}
    </div>
  );
}
