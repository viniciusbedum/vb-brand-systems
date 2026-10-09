import { cn } from "@/lib/utils";
import { Info, Warning as AlertTriangle, CheckCircle, XCircle } from "@/lib/icons";

type CalloutType = "info" | "warning" | "tip" | "danger";

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
};

const calloutConfig = {
  info: {
    icon: Info,
    classes: "border-link/30 bg-primary/5 [&_svg]:text-link",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-border bg-muted [&_svg]:text-foreground",
  },
  tip: {
    icon: CheckCircle,
    classes: "border-success/30 bg-success/5 [&_svg]:text-success",
  },
  danger: {
    icon: XCircle,
    classes: "border-destructive/30 bg-destructive/5 [&_svg]:text-destructive",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const config = calloutConfig[type] ?? calloutConfig.info;
  const Icon = config.icon;

  return (
    <div
      role="note"
      className={cn("not-prose my-6 flex gap-3 rounded-xl border p-4 text-foreground", config.classes)}
    >
      <Icon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 space-y-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <div className="text-sm leading-relaxed text-foreground/90 [&>p]:m-0">{children}</div>
      </div>
    </div>
  );
}
