import type { Metadata } from 'next'
import { SignupForm } from '@/components/login/SignupForm'
import { AuthLayout } from '@/components/login/AuthLayout'

export const metadata: Metadata = { title: 'Criar conta' }

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  )
}
