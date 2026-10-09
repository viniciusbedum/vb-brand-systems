'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { localeHref, type Locale } from '@/i18n/locale-href'
import { createClient } from '@/lib/supabase'
import { Button, buttonVariants } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function ForgotPasswordForm() {
  const t = useTranslations('auth')
  const locale = useLocale() as Locale
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${localeHref('/reset-password', locale)}`,
    })

    setLoading(false)
    if (resetError) {
      setError(t('forgot.failed'))
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{t('forgot.checkEmail')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('forgot.sent', { email })}
          </p>
        </div>
        <Link href="/login" className={buttonVariants({ variant: 'outline' }) + ' w-full'}>
          {t('forgot.backToLogin')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">{t('forgotTitle')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('forgot.subtitle')}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label={t('email')} htmlFor="email">
          <Input
            type="email"
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('forgot.submitting') : t('forgot.submit')}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        {t('forgot.remembered')}{' '}
        <Link href="/login" className={buttonVariants({ variant: 'link', size: 'sm' })}>
          {t('signup.signIn')}
        </Link>
      </p>
    </div>
  )
}
