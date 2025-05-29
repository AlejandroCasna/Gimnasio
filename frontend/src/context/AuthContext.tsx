'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/lib/api'

export interface User {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  groups: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthCtx = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
})


const publicPaths = ['/', '/login', '/register', '/about', '/profes']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router                = useRouter()
  const pathname              = usePathname()

  // 1) Al montar: si hay token lo inyectamos y cargamos perfil
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get<User>('me/')
        .then(r => setUser(r.data))
        .catch(() => {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  // 2) Protege rutas client-side
  useEffect(() => {
    if (loading) return
    if (publicPaths.includes(pathname)) return
    if (!user) router.replace('/login')
  }, [loading, pathname, user, router])

  // 3) Función de login
  async function login(username: string, password: string) {
    const { data } = await api.post('token/', { username, password })
    const { access, refresh } = data
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`
    const me = await api.get<User>('me/')
    setUser(me.data)
    
    if (me.data.groups.includes('Trainer')) {
      router.push('/dashboard/trainer')} 
    else {
      router.push('/dashboard/client')
}
  }

  // 4) Función de logout
  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
