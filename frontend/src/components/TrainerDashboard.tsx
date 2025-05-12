// frontend/src/components/TrainerDashboard.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react'
import { api } from '@/lib/api'
import { toast } from 'sonner'

interface Client {
  id: number
  username: string
  first_name: string
  last_name: string
  email: string
  phone: string
}

export default function TrainerDashboard() {
  // — estados
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [form, setForm] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })
  const [submitting, setSubmitting] = useState(false)

  // — función que carga la lista de clientes
  const loadClients = async () => {
    try {
      setLoadingClients(true)
      const res = await api.get<Client[]>('/api/trainer/clients/')
      setClients(res.data)
    } catch (err) {
      console.error(err)
      toast.error('No pude cargar tus clientes')
    } finally {
      setLoadingClients(false)
    }
  }

  // — al montar, traer clientes
  useEffect(() => {
    loadClients()
  }, [])

  // — manejo del envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/api/trainer/create-client/', form)
      toast.success('Cliente creado 🎉')
      setForm({ username: '', first_name: '', last_name: '', email: '', phone: '' })
      await loadClients()
    } catch (err: any) {
      console.error(err)
      toast.error(err?.response?.data?.detail || 'Error creando cliente')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* — Formulario de creación */}
      <div className="max-w-md p-6 bg-zinc-800 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Crear cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {(['username','first_name','last_name','email','phone'] as const).map((k) => (
            <input
              key={k}
              type={k === 'email' ? 'email' : 'text'}
              placeholder={k.replace(/_/g,' ')}
              value={form[k]}
              onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
              className="w-full p-2 bg-zinc-700 rounded text-white focus:outline-none"
              required
            />
          ))}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2 rounded font-medium transition
              ${submitting ? 'bg-red-700 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 text-white'}`}
          >
            {submitting ? 'Creando…' : 'Crear cliente'}
          </button>
        </form>
      </div>

      {/* — Listado de clientes */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Mis Clientes</h2>
        {loadingClients
          ? <p>Cargando clientes…</p>
          : clients.length
            ? clients.map(c => (
                <div
                  key={c.id}
                  className="p-3 mb-2 border border-zinc-600 rounded"
                >
                  <strong>{c.username}</strong> — {c.first_name} {c.last_name} ({c.email}, {c.phone})
                </div>
              ))
            : <p className="text-zinc-400">No tienes clientes aún.</p>
        }
      </div>
    </div>
  )
}
