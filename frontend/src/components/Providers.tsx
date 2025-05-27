// frontend/src/components/Providers.tsx
'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { AuthProvider, useAuth } from '@/context/AuthContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
