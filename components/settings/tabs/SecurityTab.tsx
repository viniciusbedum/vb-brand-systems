'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Props = {
  email: string | null
}

export function SecurityTab({ email }: Props) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleChangePassword() {
    if (!newPassword || newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ type: 'success', text: 'Senha atualizada com sucesso.' })
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro ao atualizar senha.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold tracking-tight">Segurança</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie sua senha e configurações de acesso.
        </p>
      </div>

      <div className="max-w-sm space-y-5">
        <Field label="E-mail" htmlFor="security-email">
          <Input
            type="email"
            autoComplete="email"
            value={email ?? ''}
            readOnly
            className="cursor-not-allowed bg-muted/40 text-muted-foreground"
          />
        </Field>

        <Field label="Nova senha" htmlFor="security-new-password">
          <Input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>

        <Field label="Confirmar nova senha" htmlFor="security-confirm-password">
          <Input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
          />
        </Field>

        {message && (
          <div
            role="status"
            className={cn(
              'rounded-lg px-3 py-2 text-sm',
              message.type === 'success'
                ? 'bg-success/10 text-success'
                : 'bg-destructive/10 text-destructive'
            )}
          >
            {message.text}
          </div>
        )}

        <Button onClick={handleChangePassword} disabled={saving || !newPassword}>
          {saving ? 'Atualizando…' : 'Atualizar senha'}
        </Button>
      </div>
    </div>
  )
}
