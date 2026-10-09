import { useTranslations } from "next-intl";

type Token = {
  name: string;
  value: string;
  description?: string;
};

type TokenTableProps = {
  tokens: Token[];
};

export function TokenTable({ tokens }: TokenTableProps) {
  const t = useTranslations("mdx");
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Token</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("value")}</th>
            <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("description")}</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name} className="border-t border-border">
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-foreground">{token.name}</td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-link">{token.value}</td>
              <td className="min-w-48 px-4 py-3 text-xs text-muted-foreground">{token.description ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
