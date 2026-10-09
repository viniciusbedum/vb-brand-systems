import { brand } from "@/brand/config";
import { Card } from "@/components/ui/card";

type TypographySampleProps = {
  /** Valor CSS de font-family — ex.: "var(--font-heading)" */
  fontFamily: string;
  /** Nome exibido no card (padrão: o próprio fontFamily) */
  label?: string;
  weights?: number[];
  specimenText?: string;
  usage?: string;
};

export function TypographySample({
  fontFamily,
  label = fontFamily,
  weights = [400, 500, 600, 700],
  specimenText = brand.specimenText,
  usage,
}: TypographySampleProps) {
  return (
    <Card className="not-prose my-6 space-y-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {usage && <p className="text-xs text-muted-foreground">{usage}</p>}
      </div>

      {weights.map((weight) => (
        <div key={weight} className="space-y-1">
          <p className="text-xs text-muted-foreground font-mono">{weight}</p>
          <p
            className="break-words text-2xl leading-tight"
            style={{ fontFamily, fontWeight: weight }}
          >
            {specimenText}
          </p>
        </div>
      ))}

      <div className="pt-2 border-t border-border text-xs text-muted-foreground font-mono break-words">
        {label} · {weights.join(", ")}
      </div>
    </Card>
  );
}
