import { UploadSimple as Upload } from "@/lib/icons";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type EmptyStateProps = {
  message: string;
  extensions: string[];
};

export function EmptyState({ message, extensions }: EmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center border-dashed px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
        <Upload size={24} className="text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="mb-3 text-sm font-medium">{message}</p>
      <p className="mb-2 text-xs text-muted-foreground">Formatos aceitos</p>
      <div className="flex flex-wrap justify-center gap-1.5">
        {extensions.map((ext) => (
          <Badge key={ext} variant="secondary">
            {ext}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
