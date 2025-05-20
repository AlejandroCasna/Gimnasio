// frontend/src/components/chat/ChatSidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { ChatThread, Trainer } from '@/lib/types'

interface Props { onSelect(thread: ChatThread): void }

export default function ChatSidebar({ onSelect }: Props) {
  const [threads,  setThreads]  = useState<ChatThread[]>([])
  const [trainers, setTrainers] = useState<Trainer[]>([])

  useEffect(() => {
    api.get<ChatThread[]>('/chat/threads/')
      .then(r => setThreads(r.data))
      .catch(console.error)

    api.get<Trainer[]>('/trainers/')
      .then(r => setTrainers(r.data))
      .catch(console.error)
  }, [])

  function startChat(trainerId: number) {
    api.post<ChatThread>('/chat/threads/', { trainer: trainerId })
      .then(r => {
        setThreads(ts => [...ts, r.data])
        onSelect(r.data)
      })
      .catch(console.error)
  }

  return (
    <div className="w-64 bg-zinc-800 text-white p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-zinc-200">Tus conversaciones</h3>
        <ul>
          {threads.length === 0 && <li className="text-zinc-500">— sin chats aún —</li>}
          {threads.map(t => (
            <li key={t.id}>
              <button
                className="w-full text-left py-1 hover:bg-zinc-700 rounded text-zinc-100"
                onClick={() => onSelect(t)}
              >
                {t.trainer_username} ↔ { /* o “Chat #” + t.id */ }
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-zinc-200">Comenzar chat</h3>
        <ul>
          {trainers.length === 0
            ? <li className="text-zinc-500">Cargando entrenadores…</li>
            : trainers.map(tr => (
                <li key={tr.id}>
                  <button
                    className="w-full text-left py-1 hover:bg-zinc-700 rounded text-zinc-100"
                    onClick={() => startChat(tr.id)}
                  >
                    {tr.first_name} {tr.last_name}
                  </button>
                </li>
              ))
          }
        </ul>
      </div>
    </div>
  )
}
