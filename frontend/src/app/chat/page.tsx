'use client'

import { useState }       from 'react'
import ChatSidebar        from '@/components/chat/ChatSidebar'
import ChatWindow         from '@/components/chat/ChatWindow'
import type { ChatThread } from '@/lib/types'

export default function ChatPage() {
  const [selected, setSelected] = useState<ChatThread|null>(null)

  return (
    <div className="flex h-full">
      <ChatSidebar onSelect={t => setSelected(t)} />
      {selected ? (
        <ChatWindow threadId={selected.id} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-500">
          Selecciona un chat…
        </div>
      )}
    </div>
  )
}
