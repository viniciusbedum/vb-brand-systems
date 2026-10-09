'use client'

import { useState } from 'react'
import { User, Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { SettingsModal } from '@/components/settings/SettingsModal'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { isDemoMode } from '@/lib/features'

type SidebarFooterProps = {
  displayName: string
  email: string | null
  role: 'admin' | 'staff' | null
  userId: string | null
}

export function SidebarFooter({ displayName, email, role, userId }: SidebarFooterProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'members'>('account')
  const router = useRouter()

  async function handleSignOut() {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {
      // ignore if supabase not configured
    }
    router.push('/login')
  }

  function openSettings(tab: 'account' | 'security' | 'members' = 'account') {
    setActiveTab(tab)
    setModalOpen(true)
  }

  const roleLabel = isDemoMode ? 'modo demo' : role === 'admin' ? 'admin' : 'staff'

  const avatar = (
    <span className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-link">
      <User aria-hidden="true" className="size-4" />
    </span>
  )

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        {isDemoMode ? (
          // Modo demo: sem ações de conta, então nada de menu vazio — só a identificação.
          <div
            className="flex h-12 min-w-0 flex-1 items-center gap-2.5 px-2"
            title="Modo demonstração — nada é salvo."
          >
            {avatar}
            <span className="flex min-w-0 flex-col text-left">
              <span className="truncate text-sm font-medium">{displayName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {roleLabel}
                <span className="sr-only"> — Modo demonstração, nada é salvo.</span>
              </span>
            </span>
          </div>
        ) : (
          <DropdownMenu className="block min-w-0 flex-1">
            <DropdownMenuTrigger
              aria-label={`Menu da conta de ${displayName}`}
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'md' }),
                'h-12 w-full justify-start gap-2.5 px-2 font-normal'
              )}
            >
              {avatar}
              <span className="flex min-w-0 flex-col text-left">
                <span className="truncate text-sm font-medium">{displayName}</span>
                <span className="truncate text-xs text-muted-foreground">{roleLabel}</span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-full min-w-56">
              {email && <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>}
              <DropdownMenuItem onSelect={() => openSettings('account')}>
                <Settings aria-hidden="true" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={handleSignOut}>
                <LogOut aria-hidden="true" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>

      {modalOpen && (
        <SettingsModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          displayName={displayName}
          email={email}
          role={role ?? 'staff'}
          userId={userId ?? ''}
        />
      )}
    </>
  )
}
