// frontend/src/components/Header.tsx
'use client'

import { useTheme }  from 'next-themes'

import Link          from 'next/link'
import LoginModal from './LoginModal'
import {Instagram, LogIn, MessageSquare } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { user, loading }   = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)

 
  const toggleTheme = () =>
    setTheme(theme === 'dark' ? 'light' : 'dark')

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    // 2) redirige al home recargando toda la app
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur shadow-sm">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4">

        {/* --- IZQUIERDA: logo + RRSS --- */}
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="El Bajo Entrena"
            
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <Link href="/" className="font-semibold tracking-wide text-red-600">
            El Bajo Entrena
          </Link>

          {/* WhatsApp */}
          <a
            href="https://wa.me/34697100080?text=¡Hola!%20Quiero%20saber%20más%20sobre%20El%20Bajo%20Entrena"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-600"
            title="Contáctanos por WhatsApp"
          >
            <MessageSquare className="h-5 w-5" />
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/elbajoentrena?igsh=enk3NWs2MTVlMGhv"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-600"
            title="Síguenos en Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
        </div>

        {/* --- DERECHA: navegación usuario --- */}
        <nav className="flex items-center gap-4 text-sm">
          {!loading && user?.groups.includes('Trainer') && (
            <Link href="/dashboard/trainer" className="hover:underline">
              Dashboard
            </Link>
          )}
          {!loading && user && !user.groups.includes('Trainer') && (
            <Link href="/profile" className="hover:underline">
              Mi Perfil
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded bg-zinc-200 dark:bg-zinc-700"
          >
            {theme === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
          </button>

          {!loading && user ? (
            <div className="flex items-center gap-4">
              <span>Bienvenido, <strong>{user.username}</strong></span>
              <button onClick={logout} className="hover:underline">
                Cerrar sesión
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </button>
          )}
        </nav>
      </div>
    {/* Aquí incluimos el modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  )
}
