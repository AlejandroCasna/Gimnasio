'use client'

import { useRouter } from 'next/navigation'
import Link         from 'next/link'
import { Dumbbell } from 'lucide-react'
import { useAuth }  from '@/hooks/useAuth'

export default function Header() {
  const { user, loading } = useAuth()
  const router            = useRouter()

  const handleLogout = () => {
    // Borramos tokens y redirigimos al login
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  return (
    <header className="bg-zinc-900/90 backdrop-blur sticky top-0 z-50 shadow-md">
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-red-600" />
          <Link href="/" className="font-semibold tracking-wide text-red-600">
            El Bajo Entrena
          </Link>
        </div>

        <nav className="flex items-center gap-6 text-sm">
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

          {!loading && user ? (
            <div className="flex items-center gap-4">
              <span>Bienvenido, <strong>{user.username}</strong></span>
              <button
                onClick={handleLogout}
                className="hover:underline"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            !loading && (
              <Link href="/login" className="hover:underline">
                Iniciar sesión
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  )
}
