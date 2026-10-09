'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'
import { Button, buttonVariants } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function LoginForm() {
  const router = useRouter()
  const t = useTranslations('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(t('login.invalid'))
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">{t('loginTitle')}</h1>
        <p className="text-sm text-muted-foreground">{t('login.subtitle')}</p>
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

        <Field
          label={t('password')}
          htmlFor="password"
          action={
            <Link
              href="/forgot-password"
              className={buttonVariants({ variant: 'link', size: 'sm' })}
            >
              {t('login.forgot')}
            </Link>
          }
        >
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('login.submitting') : t('login.submit')}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        {t('login.noAccount')}{' '}
        <Link href="/signup" className={buttonVariants({ variant: 'link', size: 'sm' })}>
          {t('login.createAccount')}
        </Link>
      </p>
    </div>
  )
}
