import { Skeleton } from "@/components/ui/skeleton";

export default function AssetCategoryLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 pb-16 pt-8 sm:px-6 md:pt-12 lg:px-8">
      <Skeleton className="h-36 rounded-xl" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
