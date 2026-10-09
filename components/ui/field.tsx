import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  action?: React.ReactNode;
  children: React.ReactElement;
  className?: string;
}

export function Field({ label, htmlFor, error, hint, action, children, className }: FieldProps) {
  const childProps = children.props as Record<string, unknown>;
  const describedBy =
    [
      childProps["aria-describedby"] as string | undefined,
      hint && `${htmlFor}-hint`,
      error && `${htmlFor}-error`,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={htmlFor}>{label}</Label>
        {action}
      </div>
      {React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        id: htmlFor,
        // Com erro, força true; sem erro, preserva o aria-invalid do próprio controle.
        "aria-invalid": error ? true : childProps["aria-invalid"],
        "aria-describedby": describedBy,
      })}
      {hint && (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
