// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

console.log('BACKEND_URL en cliente:', process.env.NEXT_PUBLIC_BACKEND_URL)

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || ''
    console.log('🚀 BACKEND URL:', BACKEND)
    
    
    try {
      // 1) Pido access + refresh
      const res = await fetch(`${BACKEND}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        // Si la credencial es incorrecta, saco el detalle (si viene) o mensaje genérico
        const errData = await res.json().catch(() => null)
        throw new Error(errData?.detail || 'Usuario o contraseña incorrectos')
      }

      const data = await res.json() as { access: string, refresh: string }

      // 2) Guardo en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.access)
        localStorage.setItem('refreshToken', data.refresh)
        // guardamos usuario para mostrarlo en el Header
        localStorage.setItem('user', username)
      }

      // 3) Redirijo al dashboard
      router.push('/dashboard/trainer')
    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message)
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
          <p className="text-red-500 text-center">
            {error}
          </p>
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
