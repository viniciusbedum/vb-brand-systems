import { brand } from '@/brand/config'
import { Card } from '@/components/ui/card'

// Fundo em gradiente animado + cartão translúcido com o wordmark da marca.
// O gradiente é sempre escuro, então a classe `dark` força os tokens do tema escuro
// nesta subárvore (contraste AA do cartão também no tema claro).
export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark relative flex min-h-dvh w-full items-center justify-center px-4 py-8 text-foreground [color-scheme:dark]">
      <div className="animate-gradient absolute inset-0" aria-hidden="true" />
      <Card glass className="relative z-10 w-full max-w-sm space-y-8 p-8">
        <span className="block select-none font-heading text-sm font-bold tracking-[0.18em] text-foreground">
          {brand.wordmark}
        </span>
        {children}
      </Card>
    </div>
  )
}
