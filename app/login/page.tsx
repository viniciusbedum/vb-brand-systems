import type { Metadata } from 'next'
import { LoginForm } from '@/components/login/LoginForm'
import { AuthLayout } from '@/components/login/AuthLayout'

export const metadata: Metadata = { title: 'Acessar' }

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  )
}
