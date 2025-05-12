'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import AltaClientes from '@/components/trainer/AltaClientes'
import type { Client } from '@/lib/types'
import { api } from '@/lib/api'

export default function TrainerDashboard() {
  const [clients, setClients] = useState<Client[]>([])

  const reloadClients = () => {
    api.get<Client[]>('/trainer/clients/')
      .then(res => setClients(res.data))
      .catch(err => console.error('Error cargando clientes:', err))
  }

  useEffect(reloadClients, [])

  return (
    <>
      <Header />

      <div className="min-h-screen bg-black bg-[url('/logo.png')] bg-cover bg-center bg-opacity-20">
        <div className="max-w-5xl mx-auto py-8 px-4 text-white">
          <Tabs defaultValue="alta">
            <TabsList>
              <TabsTrigger value="alta">Alta de clientes</TabsTrigger>
              <TabsTrigger value="clientes">Clientes</TabsTrigger>
              <TabsTrigger value="rutina">Rutina</TabsTrigger>
            </TabsList>

            <TabsContent value="alta">
              <AltaClientes onCreated={reloadClients} />
            </TabsContent>

            <TabsContent value="clientes">
              {clients.length === 0 ? (
                <p className="text-center">No tienes aún clientes.</p>
              ) : (
                clients.map(c => (
                  <div
                    key={c.id}
                    className="mb-2 p-2 bg-zinc-800 rounded"
                  >
                    {c.username} — {c.first_name} {c.last_name} (
                    {c.email}, {c.phone})
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent value="rutina">
              <p>Gestión de Rutinas (Implementación pendiente)</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
