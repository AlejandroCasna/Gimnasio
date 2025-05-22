// frontend/src/components/trainer/ClientProfile.tsx
'use client'

import ChatSidebar from '@/components/chat/ChatSidebar'
import ChatWindow  from '@/components/chat/ChatWindow'
import ClientRoutine from './ClientRoutine'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/lib/api'
import type { Profile, ChatThread } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'

interface ClientProfileProps {
  clientId?: number
}

export default function ClientProfile({ clientId }: ClientProfileProps) {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm]       = useState<Partial<Profile>>({})
  const [editing, setEditing] = useState(false)
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null)

  useEffect(() => {
    if (loading || !user) return
    const url = clientId && user.groups.includes('Trainer')
      ? `/trainer/${clientId}/profile/`
      : '/me/'

    api.get<Profile>(url)
      .then(res => {
        setProfile(res.data)
        setForm(res.data)
      })
      .catch(console.error)
  }, [loading, user, clientId])

  if (loading)   return <p>Cargando…</p>
  if (!user)     return <p className="text-red-500">No autorizado</p>
  if (!profile)  return <p>Cargando perfil…</p>

  const isTrainerView = Boolean(clientId && user.groups.includes('Trainer'))
  const saveUrl = isTrainerView
    ? `/trainer/${clientId}/profile/`
    : '/me/'

  const handleSave = async () => {
    await api.put<Profile>(saveUrl, form)
    setEditing(false)
    const res = await api.get<Profile>(saveUrl)
    setProfile(res.data)
    setForm(res.data)
  }

  return (
    <div className="max-w-4xl w-full mx-auto p-8 bg-zinc-900 text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4">
        { isTrainerView
            ? `Perfil del cliente ${profile.username}`
            : 'Mi Perfil'
        }
      </h1>

      <Tabs defaultValue="perfil">
        {/* Aquí quitamos className de TabsList */}
        <div className="mb-4">
          <TabsList>
            <TabsTrigger value="perfil">Perfil</TabsTrigger>
            <TabsTrigger value="pago">Pago</TabsTrigger>
            <TabsTrigger value="rutina">Rutina</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
        </div>

        {/* PESTAÑA PERFIL */}
        {/* Quitamos className de TabsContent */}
        <TabsContent value="perfil">
          <div className="space-y-4">
            <Input readOnly value={profile.username}   placeholder="Usuario" />
            <Input readOnly value={profile.first_name} placeholder="Nombre"  />
            <Input readOnly value={profile.last_name}  placeholder="Apellido"/>

            {editing
              ? (
                <>
                  <Input
                    type="email"
                    placeholder="Correo"
                    value={form.email   ?? ''}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  <Input
                    placeholder="Teléfono"
                    value={form.phone   ?? ''}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Peso (kg)"
                    value={form.weight  ?? ''}
                    onChange={e => setForm(f => ({ ...f, weight: Number(e.target.value) }))}
                  />
                  <Input
                    type="number"
                    placeholder="Edad"
                    value={form.age     ?? ''}
                    onChange={e => setForm(f => ({ ...f, age: Number(e.target.value) }))}
                  />
                  <Input
                    type="number"
                    placeholder="Altura (cm)"
                    value={form.height  ?? ''}
                    onChange={e => setForm(f => ({ ...f, height: Number(e.target.value) }))}
                  />
                  <Button onClick={handleSave} className="w-full">Guardar</Button>
                </>
              )
              : (
                <>
                  <p>📧 {profile.email}</p>
                  <p>📱 {profile.phone}</p>
                  <p>⚖️ {profile.weight} kg</p>
                  <p>🎂 {profile.age} años</p>
                  <p>📏 {profile.height} cm</p>
                  <Button onClick={() => setEditing(true)} className="w-full">
                    Editar perfil
                  </Button>
                </>
              )
            }
          </div>
        </TabsContent>

        {/* PESTAÑA PAGO */}
        <TabsContent value="pago">
          <p>💳 Pago: <em>(en producción)</em></p>
        </TabsContent>

        {/* PESTAÑA RUTINA */}
        <TabsContent value="rutina">
        <ClientRoutine />
        </TabsContent>

 {/* CHAT */}
        <TabsContent value="chat">
        <div className="flex gap-4 h-[600px]"> {/* ajusta altura fija o min-h */}
          <ChatSidebar onSelect={t => setSelectedThread(t)} />
          <div className="flex-1">
            {selectedThread
              ? <ChatWindow threadId={selectedThread.id} />
              : <div className="flex h-full items-center justify-center text-zinc-500">
                  Selecciona un chat…
                </div>
            }
          </div>
        </div>
      </TabsContent>
      </Tabs>
    </div>
  )
}