'use client'

import { useEffect } from 'react'
import { useRouter }     from 'next/navigation'
import { useAuth }       from '@/hooks/useAuth'
import ClientProfile from '@/components/trainer/ClientProfile'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router            = useRouter()

  // Si es trainer, lo mando al dashboard de trainers
  useEffect(() => {
    if (!loading && user?.groups.includes('Trainer')) {
      router.replace('/dashboard/trainer')
    }
  }, [user, loading, router])

  if (loading) return <p className="p-4 text-center">Cargando…</p>
  if (!user)    return <p className="p-4 text-center text-red-500">No autorizado</p>

  // Renderiza las 4 pestañas, arrancando por tu formulario
  return <ClientProfile />
}
