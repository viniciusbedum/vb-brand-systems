import type { MDXComponents } from "mdx/types";
import { Callout } from "./Callout";
import { ColorSwatch } from "./ColorSwatch";
import { ColorPalette } from "./ColorPalette";
import { TypographySample } from "./TypographySample";
import { TokenTable } from "./TokenTable";

export const mdxComponents: MDXComponents = {
  // Substituições de elementos HTML padrão
  h1: ({ children, ...props }) => (
    <h1 className="font-heading text-3xl font-bold tracking-tight mt-10 mb-4 text-foreground scroll-mt-20 [&_a]:text-inherit [&_a]:no-underline" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="font-heading text-2xl font-semibold tracking-tight mt-14 mb-4 scroll-mt-20 text-foreground [&_a]:text-inherit [&_a]:no-underline" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-lg font-semibold mt-10 mb-3 scroll-mt-20 text-foreground [&_a]:text-inherit [&_a]:no-underline" {...props}>
      {children}
    </h3>
  ),
  a: ({ children, ...props }) => (
    <a className="text-link underline underline-offset-4 hover:opacity-80 transition-opacity break-words" {...props}>
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-link/40 pl-4 italic text-muted-foreground my-4" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }) => (
    <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono break-words" {...props}>
      {children}
    </code>
  ),
  pre: ({ children, ...props }) => (
    <pre className="overflow-x-auto rounded-xl" {...props}>
      {children}
    </pre>
  ),
  img: ({ alt, ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt ?? ""} className="rounded-xl max-w-full h-auto" {...props} />
  ),
  table: ({ children, ...props }) => (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="bg-muted/50 text-left font-medium px-4 py-3" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-3 border-t border-border align-top" {...props}>
      {children}
    </td>
  ),
  hr: () => <hr className="border-border my-8" />,
  li: ({ children, ...props }) => (
    <li className="mb-2" {...props}>
      {children}
    </li>
  ),

  // Componentes customizados de marca
  Callout,
  ColorSwatch,
  ColorPalette,
  TypographySample,
  TokenTable,
};
