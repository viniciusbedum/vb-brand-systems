'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type Props = {
  displayName: string
  email: string | null
  userId: string
}

export function MyAccountTab({ displayName, email, userId }: Props) {
  const [name, setName] = useState(displayName)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    try {
      const supabase = createClient()
      await supabase.from('profiles').update({ name }).eq('id', userId)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // ignore
    } finally {
      setSaving(false)
    }
  }

  const initials = (name || displayName || 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold tracking-tight">Minha conta</h3>
        <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex size-14 select-none items-center justify-center rounded-full bg-primary/20 text-lg font-semibold text-link">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium">{name || displayName}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="max-w-sm space-y-5">
        <Field label="Nome de exibição" htmlFor="settings-name">
          <Input
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
        </Field>

        <Field label="E-mail" htmlFor="settings-email">
          <Input
            type="email"
            autoComplete="email"
            value={email ?? ''}
            readOnly
            className="cursor-not-allowed bg-muted/40 text-muted-foreground"
          />
        </Field>

        <Button onClick={handleSave} disabled={saving || name === displayName}>
          {saved ? 'Salvo!' : saving ? 'Salvando…' : 'Salvar alterações'}
        </Button>
      </div>
    </div>
  )
}
