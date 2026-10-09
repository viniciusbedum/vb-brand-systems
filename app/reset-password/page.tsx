import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/login/ResetPasswordForm'
import { AuthLayout } from '@/components/login/AuthLayout'

export const metadata: Metadata = { title: 'Nova senha' }

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
