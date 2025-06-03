// frontend/src/components/LoginForm.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner' // opcional, si quieres notificaciones

export default function LoginForm({ onClose }: { onClose: () => void }) {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(username, password)
      // Al hacer login exitoso, onClose cierra el modal
      onClose()
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err)
      toast.error('Usuario o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold text-white text-center">Entrenar</h2>

      <div>
        <label htmlFor="username" className="sr-only">
          Usuario
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="sr-only">
          Contraseña
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Cargando...' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}
