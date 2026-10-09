import type { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/login/ForgotPasswordForm'
import { AuthLayout } from '@/components/login/AuthLayout'

export const metadata: Metadata = { title: 'Recuperar senha' }

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
