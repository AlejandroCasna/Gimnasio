// frontend/src/app/login/page.tsx
'use client'

import LoginForm from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <LoginForm onClose={() => {}} />
    </div>
  )
}
