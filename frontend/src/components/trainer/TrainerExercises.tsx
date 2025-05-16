'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface Exercise {
  id: number
  name: string
  video_url: string
}

export default function TrainerExercises() {
  const [list, setList] = useState<Exercise[]>([])
  const [name, setName] = useState('')
  const [url,  setUrl]  = useState('')

  // 1) cargar ejercicios
  useEffect(() => {
    api.get<Exercise[]>('/trainer/exercises/')
      .then(r => setList(r.data))
      .catch(console.error)
  }, [])

  // 2) añadir ejercicio
  const handleAdd = async () => {
    const { data } = await api.post<Exercise>('/trainer/exercises/', {
      name,
      video_url: url,
    })
    setList([...list, data])
    setName('')
    setUrl('')
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          className="flex-1 bg-zinc-800 text-white p-2 rounded"
          placeholder="Nombre ejercicio"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="flex-1 bg-zinc-800 text-white p-2 rounded"
          placeholder="URL video"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <button
          className="bg-red-600 px-4 rounded"
          onClick={handleAdd}
          disabled={!name || !url}
        >Añadir</button>
      </div>

      <ul className="space-y-2">
        {list.map(ex => (
          <li key={ex.id} className="flex justify-between bg-zinc-900 p-2 rounded">
            <span>{ex.name}</span>
            <a href={ex.video_url} target="_blank" rel="noopener noreferrer" className="underline text-sm">Ver</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
