import { AssetCard, type AssetFile } from "./AssetCard";

type AssetGridProps = {
  assets: AssetFile[];
  onDelete: (id: string, storagePath: string) => void;
  isAdmin: boolean;
};

export function AssetGrid({ assets, onDelete, isAdmin }: AssetGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} onDelete={onDelete} isAdmin={isAdmin} />
      ))}
    </div>
  );
}
