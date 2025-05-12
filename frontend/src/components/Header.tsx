'use client'

import { useState, useEffect } from 'react'
import { Dumbbell } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Header() {
  const [user, setUser] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined')
      setUser(localStorage.getItem('user'))
  }, [])

  function handleLogout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <header className="bg-zinc-900/90 backdrop-blur sticky top-0 z-50 shadow-md">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-red-600" />
          <span className="font-semibold tracking-wide text-red-600">
            El Bajo Entrena
          </span>
        </div>
        <nav className="text-sm">
          {user ? (
            <div className="flex items-center gap-4">
              <span>Bienvenido, <strong>{user}</strong></span>
              <button
                onClick={handleLogout}
                className="hover:underline"
              >
                Cerrar sesión →
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hover:underline flex items-center gap-1"
            >
              Iniciar sesión →
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
