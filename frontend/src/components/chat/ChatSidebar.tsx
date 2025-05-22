// frontend/src/components/chat/ChatSidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import type { ChatThread, Trainer, Client } from '@/lib/types'

interface Props {
  onSelect(thread: ChatThread): void
}

export default function ChatSidebar({ onSelect }: Props) {
  const { user, loading } = useAuth()
  const isTrainer = user?.groups.includes('Trainer')

  const [threads,  setThreads]  = useState<ChatThread[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [clients,  setClients]  = useState<Client[]>([])

  useEffect(() => {
    if (!user) return

    // 1) Hilos existentes
    api.get<ChatThread[]>('chat/threads/')
      .then(r => setThreads(r.data))
      .catch(console.error)

    // 2) Lista de entrenadores
    api.get<Trainer[]>('trainers/')
      .then(r => setTrainers(r.data))
      .catch(console.error)

    // 3) Si soy trainer, también traigo mis clientes
    if (isTrainer) {
      api.get<Client[]>('trainer/clients/')
        .then(r => setClients(r.data))
        .catch(console.error)
    }
  }, [user, isTrainer])

  if (loading) return null

  // Función unificada para abrir o crear un hilo
  const goToChatWith = (otherId: number, role: 'trainer' | 'client') => {
    // 1) Si ya existe hilo
    const existing = threads.find(t =>
      role === 'trainer'
        ? t.trainer === otherId
        : t.client  === otherId
    )
    if (existing) {
      return onSelect(existing)
    }

    // 2) Si no existe, lo creamos
    const payload: any = {}
    if (role === 'trainer') payload.trainer = otherId
    else                  payload.client  = otherId

    api.post<ChatThread>('chat/threads/', payload)
      .then(r => {
        setThreads(ts => [...ts, r.data])
        onSelect(r.data)
      })
      .catch(console.error)
  }

  // Atajo para entrenadores
  const goToChatWithTrainer = (id: number) => goToChatWith(id, 'trainer')

  return (
    <div className="w-80 h-full bg-zinc-800 text-white p-4 flex flex-col">
      {/* Conversaciones existentes */}
      <div className="flex-1 overflow-auto mb-6">
        <h3 className="font-semibold mb-2">Tus conversaciones</h3>
        <ul className="space-y-1">
          {threads.length > 0
            ? threads.map(t => (
                <li key={t.id}>
                  <button
                    onClick={() => onSelect(t)}
                    className="w-full text-left py-1 px-2 rounded hover:bg-zinc-700"
                  >
                    {t.trainer_username} ↔ {t.client_username}
                  </button>
                </li>
              ))
            : <li className="text-zinc-500">— sin chats aún —</li>
          }
        </ul>
      </div>

      {/* Iniciar nuevo chat */}
      <div className="flex-1 overflow-auto">
        <h3 className="font-semibold mb-2">Comenzar chat</h3>

        {isTrainer && (
          <>
            <h4 className="text-zinc-300 mb-1">Clientes</h4>
            <ul className="space-y-1 mb-4 max-h-48 overflow-y-auto">
              {clients.length > 0
                ? clients.map(c => (
                    <li key={c.id}>
                      <button
                        onClick={() => goToChatWith(c.id, 'client')}
                        className="w-full text-left py-1 px-2 rounded hover:bg-zinc-700"
                      >
                        {c.first_name || c.username} {c.last_name || ''}
                      </button>
                    </li>
                  ))
                : <li className="text-zinc-500">— cargando clientes —</li>
              }
            </ul>
          </>
        )}

        <h4 className="text-zinc-300 mb-1">Entrenadores</h4>
        <ul className="space-y-1 max-h-48 overflow-y-auto">
          {trainers.length > 0
            ? trainers.map(tr => (
                <li key={tr.id}>
                  <button
                    onClick={() => goToChatWithTrainer(tr.id)}
                    className="w-full text-left py-1 px-2 rounded hover:bg-zinc-700"
                  >
                    {tr.first_name || tr.username} {tr.last_name || ''}
                  </button>
                </li>
              ))
            : <li className="text-zinc-500">— cargando entrenadores —</li>
          }
        </ul>
      </div>
    </div>
  )
}
