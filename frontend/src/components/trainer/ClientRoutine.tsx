'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import type { Routine } from '@/lib/types'
import { Button } from '@/components/ui/button'

export default function ClientRoutine() {
  const [routine, setRoutine] = useState<Routine|null>(null)

  useEffect(() => {
    api.get<Routine>('/my-routine/')
      .then(r => setRoutine(r.data))
      .catch(()=>{})
  }, [])

  if (!routine) {
    return <p>No tienes rutina asignada.</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{routine.name}</h2>
      {routine.items.map(it => (
        <div key={it.order} className="p-2 bg-zinc-800 rounded">
          <h3 className="font-semibold">{it.exercise.name}</h3>
          <p>Reps: {it.reps_range}</p>
          <div className="aspect-video">
            <iframe 
              src={it.exercise.video_url}
              title={it.exercise.name}
              allowFullScreen
              className="w-full h-full rounded"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
