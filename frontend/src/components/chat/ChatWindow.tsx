'use client'

import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api'
import type { Message } from '@/lib/types'

interface Props {
  threadId: number
}

export default function ChatWindow({ threadId }: Props) {
  const [msgs, setMsgs] = useState<Message[]>([])
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    api.get<Message[]>(`/chat/threads/${threadId}/messages/`)
      .then(r => setMsgs(r.data))
      .catch(console.error)
  }, [threadId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const send = () => {
    if (!text.trim()) return
    api.post<Message>('/chat/messages/', { thread: threadId, text })
      .then(r => {
        setMsgs(ms => [...ms, r.data])
        setText('')
      })
      .catch(err => console.error(err.response?.data || err))
  }

  return (
    <div className="flex-1 flex flex-col bg-zinc-900 p-4 rounded-lg">
      <div className="flex-1 overflow-auto space-y-2 mb-4">
        {msgs.map(m => {
          const isMe = m.author_username === localStorage.getItem('user')
          return (
            <div
              key={m.id}
              className={`p-2 rounded-lg max-w-[80%] ${
                isMe ? 'bg-red-600 self-end' : 'bg-zinc-700 self-start'
              }`}
            >
              <div className="text-xs text-zinc-400 mb-1">
                {new Date(m.timestamp).toLocaleDateString('es-AR', {
                  day: '2-digit', month: 'short', year: 'numeric'
                })}{' '}
                {new Date(m.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-white">{m.text}</div>
            </div>
          )
        })}
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
