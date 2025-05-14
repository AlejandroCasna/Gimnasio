'use client'
import { useState, useEffect, ChangeEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type { Profile } from '@/lib/types'

interface ClientProfileProps {
  clientId: number
}

export default function ClientProfile({ clientId }: ClientProfileProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<{
    weight: string
    age: string
    height: string
    phone: string
  }>({ weight: '', age: '', height: '', phone: '' })

  useEffect(() => {
    api.get<Profile>(`/trainer/${clientId}/profile/`)
      .then(res => {
        setProfile(res.data)
        setForm({
          weight: res.data.weight?.toString() || '',
          age: res.data.age?.toString() || '',
          height: res.data.height?.toString() || '',
          phone: res.data.phone,
        })
      })
  }, [clientId])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    const payload = {
      weight: parseFloat(form.weight),
      age: parseInt(form.age),
      height: parseFloat(form.height),
      phone: form.phone,
    }
    await api.put(`/trainer/${clientId}/profile/`, payload)
    setEditing(false)
    const res = await api.get<Profile>(`/trainer/${clientId}/profile/`)
    setProfile(res.data)
  }

  if (!profile) return <p>Cargando perfil...</p>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Perfil del Cliente</h2>

      {(['username','first_name','last_name','email'] as const).map(field => (
        <Input key={field} readOnly value={profile[field] || ''} />
      ))}

      {editing ? (
        <>
          <Input
            name="weight"
            placeholder="Peso (kg)"
            type="number"
            value={form.weight}
            onChange={handleChange}
          />
          <Input
            name="age"
            placeholder="Edad"
            type="number"
            value={form.age}
            onChange={handleChange}
          />
          <Input
            name="height"
            placeholder="Altura (cm)"
            type="number"
            value={form.height}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Teléfono"
            type="tel"
            value={form.phone}
            onChange={handleChange}
          />

          <Button onClick={handleSave}>Guardar</Button>
        </>
      ) : (
        <>
          <p>Peso: {profile.weight} kg</p>
          <p>Edad: {profile.age} años</p>
          <p>Altura: {profile.height} cm</p>
          <p>Teléfono: {profile.phone}</p>
          <Button onClick={() => setEditing(true)}>Editar perfil</Button>
        </>
      )}

      {/* Placeholder de Pago, Rutina y Chat */}
      <div>
        <h3>Pago</h3>
        <p>En producción</p>
      </div>
      <div>
        <h3>Rutina</h3>
        <p>Pendiente de implementación</p>
      </div>
      <div>
        <h3>Chat</h3>
        <p>Pendiente de implementación</p>
      </div>
    </div>
  )
}