// frontend/src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      // 1) Llamas al endpoint token/ con barra final:
      const { data } = await api.post<{ access: string; refresh: string }>(
        'token/',
        { username, password }
      )

      // 2) Guardas tokens:
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('refreshToken', data.refresh)

      // ←----- AQUÍ: inyectas correctamente la cabecera para todas las peticiones:
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`

      // 3) Ya con la cabecera puesta, puedes llamar a /me/ sin 403:
      const me = await api.get('/me/')
      console.log('Perfil cargado:', me.data)

      // 4) Rediriges al dashboard:
      router.push('/dashboard/trainer')

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
        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
          Iniciar sesión
        </Button>
      </form>
    </div>
  )
}
