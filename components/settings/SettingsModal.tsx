'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { User, Key, Users } from "@/lib/icons";
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { MyAccountTab } from './tabs/MyAccountTab'
import { SecurityTab } from './tabs/SecurityTab'
import { MembersTab } from './tabs/MembersTab'

type Tab = 'account' | 'security' | 'members'

type SettingsModalProps = {
  open: boolean
  onClose: () => void
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  displayName: string
  email: string | null
  role: 'admin' | 'staff'
  userId: string
}

const tabIcons: Record<Tab, React.ReactNode> = {
  account: <User aria-hidden="true" />,
  security: <Key aria-hidden="true" />,
  members: <Users aria-hidden="true" />,
}

export function SettingsModal({
  open,
  onClose,
  activeTab,
  onTabChange,
  displayName,
  email,
  role,
  userId,
}: SettingsModalProps) {
  const t = useTranslations('settings')
  const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'account', label: t('tabAccount'), icon: tabIcons.account },
    { key: 'security', label: t('tabSecurity'), icon: tabIcons.security },
    { key: 'members', label: t('tabMembers'), icon: tabIcons.members },
  ]
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({
    account: null,
    security: null,
    members: null,
  })

  // Navegação por setas entre abas (padrão WAI-ARIA tabs)
  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    const keys = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End']
    if (!keys.includes(e.key)) return
    e.preventDefault()
    let next = index
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % navItems.length
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + navItems.length) % navItems.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = navItems.length - 1
    const key = navItems[next].key
    onTabChange(key)
    tabRefs.current[key]?.focus()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose()
      }}
      title={t('title')}
      size="lg"
    >
      {open && (
        <div className="grid gap-4 md:grid-cols-[200px_1fr]">
          <div
            role="tablist"
            aria-label={t('sections')}
            aria-orientation="vertical"
            className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible"
          >
            {navItems.map((item, index) => {
              const selected = activeTab === item.key
              return (
                <Button
                  key={item.key}
                  ref={(el) => {
                    tabRefs.current[item.key] = el
                  }}
                  variant="ghost"
                  role="tab"
                  id={`settings-tab-${item.key}`}
                  aria-selected={selected}
                  aria-controls="settings-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onTabChange(item.key)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className={cn(
                    'shrink-0 justify-start whitespace-nowrap md:w-full',
                    selected ? 'bg-accent text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {item.icon}
                  {item.label}
                </Button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id="settings-panel"
            aria-labelledby={`settings-tab-${activeTab}`}
            className="min-w-0 md:pl-6"
          >
            {activeTab === 'account' && (
              <MyAccountTab displayName={displayName} email={email} userId={userId} />
            )}
            {activeTab === 'security' && <SecurityTab email={email} />}
            {activeTab === 'members' && <MembersTab role={role} currentUserId={userId} />}
          </div>
        </div>
      )}
    </Dialog>
  )
}
