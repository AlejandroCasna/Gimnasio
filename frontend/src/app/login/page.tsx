// frontend/src/app/login/page.tsx
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      // 1) Pedimos tokens
      const { data } = await api.post<{ access: string; refresh: string }>(
        'token/',
        { username, password }
      )

      // 2) Almacenamos
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`

      // 3) Esperamos a que /me/ nos confirme que todo está OK
      const me = await api.get<{ groups: string[] }>('/me/')

      // 4) Redirigimos según rol
      startTransition(() => {
        if (me.data.groups.includes('Trainer')) {
          router.replace('/dashboard/trainer')
        } else {
          router.replace('/dashboard/client')
        }
      })
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
        {error && <p className="text-red-500 text-center">{error}</p>}
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
        <Button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700"
          disabled={isPending}
        >
          {isPending ? 'Cargando…' : 'Iniciar sesión'}
        </Button>
      </form>
    </div>
  )
}
