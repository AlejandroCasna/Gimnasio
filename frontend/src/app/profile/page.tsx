// frontend/src/app/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import type { Profile } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export default function ProfilePage() {
  // 1) Todos los hooks al principio, sin condicionales
  const { user, loading } = useAuth()
  const router = useRouter()

  const [profile, setProfile]   = useState<Profile | null>(null)
  const [form, setForm]         = useState<Partial<Profile>>({})
  const [editing, setEditing]   = useState(false)

  // 2) Redirige trainers fuera de esta página
  useEffect(() => {
    if (!loading && user?.groups.includes('Trainer')) {
      router.replace('/dashboard/trainer')
    }
  }, [user, loading, router])

  // 3) Carga inicial del perfil
  useEffect(() => {
    api.get<Profile>('/me/')
      .then(res => {
        setProfile(res.data)
        setForm(res.data)
      })
      .catch(console.error)
  }, [])

  // 4) Renderizado condicional limpio
  if (loading || user?.groups.includes('Trainer')) {
    return <p>Cargando…</p>
  }
  if (!profile) {
    return <p>Cargando perfil...</p>
  }

  // 5) UI definitiva
  const handleSave = async () => {
    await api.put<Profile>('/me/', form)
    setEditing(false)
    const res = await api.get<Profile>('/me/')
    setProfile(res.data)
    setForm(res.data)
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-900 text-white rounded space-y-4">
      <h1 className="text-2xl font-bold">Mi Perfil</h1>

      {/* Campos readonly */}
      <Input readOnly value={profile.username}   placeholder="Usuario" />
      <Input readOnly value={profile.first_name} placeholder="Nombre" />
      <Input readOnly value={profile.last_name}  placeholder="Apellido" />

      {editing ? (
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
      ) : (
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
      )}

      <hr className="border-zinc-700" />
      <p><strong>Pago:</strong> (en producción)</p>
      <p><strong>Rutina:</strong> (pendiente)</p>
      <p><strong>Chat:</strong> (próximamente)</p>
    </div>
  )
}
