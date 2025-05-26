'use client'
export const dynamic = 'force-dynamic'

import { useState, useEffect, FormEvent } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface PaymentStatus {
  status: 'approved' | 'pending' | 'failure'
}

export default function RegistroClienteContent() {
  const params   = useSearchParams()
  const router   = useRouter()
  const prefId   = params.get('pref_id') || ''
  const [ok, setOk]         = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError]     = useState<string|null>(null)

  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!prefId) {
      setError('No se ha proporcionado pref_id')
      setLoading(false)
      return
    }

    fetch(`/api/payment-status/${prefId}/`)
      .then(res => res.json() as Promise<PaymentStatus>)
      .then(data => {
        if (data.status === 'approved') {
          setOk(true)
        } else {
          setError(`Pago no aprobado (${data.status})`)
        }
      })
      .catch(() => setError('Error consultando estado de pago'))
      .finally(() => setLoading(false))
  }, [prefId])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    fetch('/api/register-client/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pref_id: prefId, username, email, password })
    })
      .then(res => {
        if (!res.ok) throw new Error('Registro fallido')
        return res.json()
      })
      .then(() => {
        router.push('/login')
      })
      .catch(err => {
        setError(err.message || 'Error en el registro')
      })
      .finally(() => setLoading(false))
  }

  if (loading) return <p>Cargando…</p>
  if (error)   return <p style={{ color: 'red' }}>{error}</p>
  if (!ok) return <p>Tu pago está pendiente o no ha sido aprobado.</p>

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 20 }}>
      <h1>Registro de cliente</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario:
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <br/>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <br/>
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <br/>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando…' : 'Registrar'}
        </button>
      </form>
    </div>
  )
}
