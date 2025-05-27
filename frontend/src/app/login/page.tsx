'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'    // importamos el hook
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const { login } = useAuth()                     // obtenemos login del contexto
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      // Llamamos al login del contexto, que internamente:
      // • Hace POST /token/
// • Guarda tokens en localStorage
// • Inyecta el header Authorization en la instancia api
// • Carga el perfil y redirige a /dashboard
      await login(username, password)
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.response?.data?.detail || 'Usuario o contraseña incorrectos')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-8 rounded-lg space-y-4 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-white text-center">Entrenar</h1>

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        <Input
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="bg-zinc-800 text-white"
        />
        <Input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="bg-zinc-800 text-white"
        />

        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
          Iniciar sesión
        </Button>
      </form>
    </div>
  )
}
