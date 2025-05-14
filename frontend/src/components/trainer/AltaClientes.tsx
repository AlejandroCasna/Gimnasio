'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/api'


interface FormData {
  username: string
  first_name: string
  last_name: string
  email: string
  phone: string
  tipo: 'distancia' | 'presencial' | 'grupal'
}

interface AltaClientesProps {
  onCreated: () => void
}

export default function AltaClientes({ onCreated }: AltaClientesProps) {
  const [form, setForm] = useState<FormData>({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    tipo: 'distancia',
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)
    try {
      await api.post('/trainer/create-client/', form)
      onCreated()
      setForm({ username: '', first_name: '', last_name: '', email: '', phone: '', tipo: 'distancia' })
    } catch (err: any) {
      console.error(err)
      const data = err.response?.data
      if (data) {
        // Si viene detail (por ejemplo PermissionDenied), lo usamos
        if (data.detail) {
          setError(data.detail)
        } else {
          // Si viene un objeto de errores por campo, lo recorremos
          const messages = Object.entries(data)
            .map(([field, msgs]) =>
              // msgs puede ser string[] o string
              `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
            )
          setError(messages.join('\n'))
        }
      } else {
        setError('Error desconocido')
      }
    }
  }
  

  return (
    <div className="space-y-3">
      {error && <p className="text-red-500">{error}</p>}

      {(['username','first_name','last_name','email','phone'] as const).map((k) => (
        <Input
          key={k}
          type={k === 'email' ? 'email' : 'text'}
          placeholder={k.replace('_',' ')}
          value={form[k]}
          onChange={e =>
            setForm(f => ({ ...f, [k]: e.target.value }))
          }
          className="w-full bg-zinc-700 text-white"
        />
      ))}

      <select
        value={form.tipo}
        onChange={e =>
          setForm(f => ({ ...f, tipo: e.target.value as any }))
        }
        className="w-full p-2 rounded bg-zinc-700 text-white"
      >
        <option value="distancia">Personalizado a distancia</option>
        <option value="presencial">Personalizado presencial</option>
        <option value="grupal">Clases grupales</option>
      </select>

      <Button
        onClick={handleSubmit}
        className="w-full bg-red-600 hover:bg-red-700"
      >
        Crear cliente
      </Button>
    </div>
  )
}
