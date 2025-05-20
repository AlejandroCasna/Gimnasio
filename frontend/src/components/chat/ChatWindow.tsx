// frontend/src/components/chat/ChatWindow.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import type { Message } from '@/lib/types'

interface Props {
  threadId: number
}

export default function ChatWindow({ threadId }: Props) {
  const [msgs, setMsgs]   = useState<Message[]>([])
  const [text, setText]   = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  // 1) cargar mensajes cuando cambie threadId
  useEffect(() => {
    api.get<Message[]>(`/chat/threads/${threadId}/messages/`)
      .then(r => setMsgs(r.data))
      .catch(console.error)
  }, [threadId])

  // 2) cada vez que msgs cambia, scroll al final
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  // 3) enviar uno nuevo
  function send() {
    if (!text.trim()) return
    api.post<Message>('/chat/messages/', { thread: threadId, text })
      .then(r => {
        setMsgs([...msgs, r.data])
        setText('')
      })
      .catch(console.error)
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-900 p-4">
      <div className="flex-1 overflow-auto mb-2">
        {msgs.map(m => (
          <div key={m.id} className="mb-2">
            <div className="text-xs text-zinc-500">
              {new Date(m.timestamp).toLocaleTimeString()}
            </div>
            <div className="p-2 bg-zinc-800 rounded">{m.text}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 bg-zinc-800 rounded p-2 text-white"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Escribe un mensaje…"
        />
        <button
          className="bg-red-600 px-4 rounded"
          onClick={send}
        >
          Enviar
        </button>
      </div>
    </div>
  )
}
