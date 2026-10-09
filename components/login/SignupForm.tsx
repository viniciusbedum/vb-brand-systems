'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { createClient } from '@/lib/supabase'
import { Button, buttonVariants } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

export function SignupForm() {
  const t = useTranslations('auth')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

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
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, full_name: name } },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-semibold tracking-tight">{t('signup.created')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('signup.checkEmail')}
          </p>
        </div>
        <Link href="/login" className={buttonVariants() + ' w-full'}>
          {t('signup.goLogin')}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">{t('signupTitle')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('signup.subtitle')}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label={t('fullName')} htmlFor="name">
          <Input
            type="text"
            autoComplete="name"
            placeholder={t('namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>

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

        <Field label={t('password')} htmlFor="password">
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
          {loading ? t('signup.submitting') : t('signup.submit')}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        {t('signup.haveAccount')}{' '}
        <Link href="/login" className={buttonVariants({ variant: 'link', size: 'sm' })}>
          {t('signup.signIn')}
        </Link>
      </p>
    </div>
  )
}
