'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/lib/api'
import LoginModal from '@/components/LoginModal'

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
  openLoginModal: () => void
}

const AuthCtx = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  openLoginModal: () => {},
})


const publicPaths = ['/', '', '/register', '/about', '/profes']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const publicPaths = ['/', '/about', '/register'] // Quita '/login'

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

  // Protegemos rutas client‐side: si no hay user y la ruta no es pública,
  // en vez de redirigir a /login, abrimos modal
  useEffect(() => {
    if (loading) return
    if (publicPaths.includes(pathname)) return
    if (!user) {
      // En lugar de hacer router.replace('/login'), abrimos el modal:
      setShowLoginModal(true)
    }
  }, [loading, pathname, user])

  async function login(username: string, password: string) {
    const { data } = await api.post('token/', { username, password })
    const { access, refresh } = data
    localStorage.setItem('accessToken', access)
    localStorage.setItem('refreshToken', refresh)
    api.defaults.headers.common['Authorization'] = `Bearer ${access}`
    const me = await api.get<User>('me/')
    setUser(me.data)
    setShowLoginModal(false)
    if (me.data.groups.includes('Trainer')) {
      router.push('/dashboard/trainer')
    } else {
      router.push('/profile')
    }
  }

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    // Opcional: si te deslogueas estando en ruta privada, abre modal de login:
    setShowLoginModal(true)
  }

  const openLoginModal = () => setShowLoginModal(true)
  const closeLoginModal = () => setShowLoginModal(false)

  return (
    <AuthCtx.Provider
      value={{
        user,
        loading,
        login,
        logout,
        openLoginModal,
      }}
    >
      {children}
      {/* Montamos el modal automáticamente si showLoginModal === true */}
      <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} />
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)