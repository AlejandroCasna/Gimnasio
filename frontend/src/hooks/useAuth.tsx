// frontend/src/hooks/useAuth.tsx
'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/lib/api'

export interface User {
  id:         number
  username:   string
  first_name: string
  last_name:  string
  email:      string
  groups:     string[]
}

interface AuthContextType {
  user:    User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

// Aquí defines todas las rutas a las que quieres permitir acceso SIN estar logueado:
const publicPaths = ['/', '/login', '/register', '/payment', '/about']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 1) Si la ruta es pública, salto la protección:
    if (publicPaths.includes(pathname)) {
      setLoading(false)
      return
    }

    // 2) Si no hay token y la ruta NO es pública, voy a /login
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null

    if (!token) {
      router.replace('/login')
      return
    }

    // 3) Si hay token, intento cargar el perfil
    api.get<User>('/me/')
      .then(res => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        router.replace('/login')
      })
      .finally(() => setLoading(false))
  }, [pathname, router])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
