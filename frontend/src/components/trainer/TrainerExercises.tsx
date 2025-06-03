// frontend/src/components/TrainerExercises.tsx
'use client'

import { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface Exercise {
  id: number
  name: string
  video_url: string
}

export default function TrainerExercises() {
  // — 1) Estados
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading]     = useState<boolean>(true)
  const [error, setError]         = useState<string | null>(null)

  const [name, setName] = useState('')
  const [url,  setUrl]  = useState('')

  // — 2) Cuando el componente monta, carga la lista desde 
  //    https://eltemplo.pythonanywhere.com/trainer/exercises/
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const resp = await axios.get<Exercise[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trainer/exercises/`
        )
        setExercises(resp.data)
      } catch (err: any) {
        console.error('Error al cargar ejercicios:', err)
        setError('No se pudo cargar la lista de ejercicios.')
      } finally {
        setLoading(false)
      }
    }
    fetchExercises()
  }, [])

  // — 3) Crear un nuevo ejercicio (POST a misma ruta)
  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim() || !url.trim()) {
      setError('El nombre y la URL no pueden estar vacíos.')
      return
    }

    try {
      const payload = { name: name.trim(), video_url: url.trim() }
      const resp = await axios.post<Exercise>(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trainer/exercises/`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          // si tu backend requiere token, se inyectará automáticamente 
          // porque axios.interceptors.request ya lo hace en lib/api.ts,
          // pero aquí usamos axios directo, así que:
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`
          }
        }
      )

      setExercises(prev => [...prev, resp.data])
      setName('')
      setUrl('')
    } catch (err: any) {
      console.error('Error al crear ejercicio:', err)
      setError('No se pudo crear el ejercicio.')
    }
  }

  // — 4) Eliminar un ejercicio (DELETE a /trainer/exercises/{id}/)
  const handleDelete = async (id: number) => {
    if (!confirm('¿Seguro que quieres eliminar este ejercicio?')) return

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/trainer/exercises/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`
          }
        }
      )
      setExercises(prev => prev.filter(ex => ex.id !== id))
    } catch (err: any) {
      console.error('Error al eliminar ejercicio:', err)
      setError('No se pudo eliminar el ejercicio.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      {/* — Formulario para crear un ejercicio */}
      <section className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Crear nuevo ejercicio
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Nombre
            </label>
            <input
              id="name"
              placeholder="Nombre del ejercicio"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 focus:outline-none"
              required
            />
          </div>

          <div>
            <label
              htmlFor="url"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              URL del video
            </label>
            <input
              id="url"
              placeholder="https://..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 p-2 focus:outline-none"
              required
            />
          </div>

          <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
            Añadir ejercicio
          </Button>
        </form>
      </section>

      {/* — Listado de ejercicios ya creados */}
      <section className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Ejercicios creados
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Cargando ejercicios…</p>
        ) : exercises.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            No hay ejercicios registrados aún.
          </p>
        ) : (
          <ul className="space-y-2">
            {exercises.map(ex => (
              <li
                key={ex.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-zinc-700 p-3 rounded hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
              >
                <p className="text-gray-800 dark:text-gray-100 font-medium">
                  {ex.name}
                </p>
                <div className="flex items-center space-x-4">
                  <a
                    href={ex.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                  >
                    Ver video
                  </a>
                  <button
                    onClick={() => handleDelete(ex.id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded"
                    title="Eliminar ejercicio"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
