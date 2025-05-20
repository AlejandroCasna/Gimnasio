// frontend/src/components/Providers.tsx
'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from 'next-themes'
import { AuthProvider }    from '@/hooks/useAuth'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  )
}
