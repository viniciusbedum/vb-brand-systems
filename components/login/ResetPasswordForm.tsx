'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'
import { Button, buttonVariants } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type Status = 'verifying' | 'ready' | 'invalid'

export function ResetPasswordForm() {
  const router = useRouter()
  const t = useTranslations('auth')
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<Status>('verifying')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // O link do e-mail traz ?code= (fluxo PKCE) — troca pelo token de sessão
  useEffect(() => {
    const code = searchParams.get('code')
    const supabase = createClient()

    async function verify() {
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        setStatus(exchangeError ? 'invalid' : 'ready')
        return
      }
      const { data } = await supabase.auth.getUser()
      setStatus(data.user ? 'ready' : 'invalid')
    }
    verify()
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t('signup.mismatch'))
      return
    }
    if (password.length < 6) {
      setError(t('signup.tooShort'))
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(t('reset.failed'))
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  if (status === 'verifying') {
    return <p className="text-sm text-muted-foreground">{t('reset.verifying')}</p>
  }

  if (status === 'invalid') {
    return (
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{t('reset.invalidTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('reset.invalidText')}
          </p>
        </div>
        <Link href="/forgot-password" className={buttonVariants() + ' w-full'}>
          {t('reset.requestNew')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">{t('resetTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('reset.subtitle')}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label={t('newPassword')} htmlFor="password">
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        <Field label={t('confirmPassword')} htmlFor="confirmPassword">
          <Input
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Field>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('reset.submitting') : t('reset.submit')}
        </Button>
      </form>
    </div>
  )
}
