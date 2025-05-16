'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import type { Client } from '@/lib/types'
import { api } from '@/lib/api'
import AltaClientes from '@/components/trainer/AltaClientes'
import ClientProfile from '@/components/trainer/ClientProfile'
import RutinaManager from '@/components/trainer/RutinaManager'
import TrainerExercises from '@/components/trainer/TrainerExercises'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'

export default function TrainerDashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const [clients, setClients] = useState<Client[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // redirige si no es trainer
  useEffect(() => {
    if (!loading && !user?.groups.includes('Trainer')) {
      router.replace('/profile')
    }
  }, [user, loading, router])

  // carga inicial de clientes
  const reloadClients = () => {
    api.get<Client[]>('/trainer/clients/')
      .then(res => setClients(res.data))
      .catch(console.error)
  }
  useEffect(reloadClients, [])

  if (loading) return <p>Cargando…</p>
  if (!user?.groups.includes('Trainer')) return null

  return (
    <Tabs defaultValue="alta">
      <TabsList>
        <TabsTrigger value="alta">Alta de clientes</TabsTrigger>
        <TabsTrigger value="clientes">Clientes</TabsTrigger>
        <TabsTrigger value="rutina">Rutinas</TabsTrigger>
        <TabsTrigger value="ejercicios">Ejercicios</TabsTrigger>
      </TabsList>

      {/* Alta de clientes */}
      <TabsContent value="alta">
        <AltaClientes onCreated={reloadClients} />
      </TabsContent>

      {/* Listado o detalle de clientes */}
      <TabsContent value="clientes">
        {selectedId ? (
          <>
            <button
              className="mb-4 text-sm text-blue-400 underline"
              onClick={() => setSelectedId(null)}
            >
              ← Volver a la lista
            </button>
            <ClientProfile clientId={selectedId} />
          </>
        ) : clients.length === 0 ? (
          <p className="text-center">No tienes aún clientes.</p>
        ) : (
          clients.map(c => (
            <div
              key={c.id}
              className="mb-2 p-2 bg-zinc-800 rounded cursor-pointer hover:bg-zinc-700"
              onClick={() => setSelectedId(c.id)}
            >
              {c.username} — {c.first_name} {c.last_name}
            </div>
          ))
        )}
      </TabsContent>

      {/* Gestor de rutinas */}
      <TabsContent value="rutina">
        <RutinaManager onSaved={reloadClients} />
      </TabsContent>

      {/* Ejercicios reutilizables */}
      <TabsContent value="ejercicios">
        <TrainerExercises />
      </TabsContent>
    </Tabs>
  )
}
