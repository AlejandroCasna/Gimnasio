// frontend/src/components/RutinaManager.tsx
'use client'

import { useState, useEffect } from 'react'
import UICombobox from '@/components/ui/combobox'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import type {
  Client,
  Exercise,
  Routine,
  RoutineExercise,
} from '@/lib/types'

interface RutinaManagerProps {
  /** Se dispara tras guardar para recargar lista de clientes/rutinas */
  onSaved?: () => void
}

export default function RutinaManager({ onSaved }: RutinaManagerProps) {
  // — Selección de cliente —
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setClient] = useState<Client | null>(null)

  // — Datos de ejercicios & rutina —
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [routineName, setRoutineName] = useState('')
  const [weekNumber, setWeekNumber] = useState(1)
  const [items, setItems] = useState<RoutineExercise[]>([])

  // carga inicial de clientes y ejercicios
  useEffect(() => {
    api.get<Client[]>('/trainer/clients/').then(r => setClients(r.data))
    api.get<Exercise[]>('/exercises/').then(r => setExercises(r.data))
  }, [])

  // precarga rutina si ya existe para ese cliente+semana
  useEffect(() => {
    if (!selectedClient) return
    api.get<Routine[]>(`/trainer/${selectedClient.id}/routines/`)
      .then(r => {
        const found = r.data.find(x => x.week_number === weekNumber)
        if (found) {
          setRoutineName(found.name)
          setItems(found.items)
        } else {
          setRoutineName('')
          setItems([])
        }
      })
      .catch(console.error)
  }, [selectedClient, weekNumber])

  function addEmptyItem(day_of_week: number) {
    setItems(prev => [
      ...prev,
      {
        id: undefined,
        exercise: { id: undefined, name: '', video_url: '' } as Exercise,
        day_of_week,
        reps_range: '',
        order: prev.filter(it => it.day_of_week === day_of_week).length + 1,
      },
    ])
  }

  async function saveRoutine() {
    if (!selectedClient) return;

    // Construimos el payload usando exercise_id en lugar del objeto entero
    const payload = {
      name:        routineName,
      week_number: weekNumber,
      items: items.map(it => ({
        exercise_id: it.exercise.id,   // 🚩 clave foránea
        day_of_week: it.day_of_week,
        reps_range:  it.reps_range,
        order:       it.order,
      })),
    };

    try {
      await api.post(
        `/trainer/${selectedClient.id}/routines/`,
        payload
      );
      alert('Rutina guardada correctamente');
      onSaved?.();
    } catch (err: any) {
      console.error(err.response?.data);
      alert(
        'No se pudo guardar la rutina:\n' +
        JSON.stringify(err.response?.data, null, 2)
      );
    }
  }

  return (
    <div className="space-y-6 p-6 bg-zinc-900 rounded max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white">Crear / Editar Rutina</h2>

      {/* 1) Selector de cliente */}
      <UICombobox
        options={clients.map(c => ({ id: c.id, name: c.username }))}
        value={
          selectedClient
            ? { id: selectedClient.id, name: selectedClient.username }
            : null
        }
        onChange={opt => {
          const cli = opt ? clients.find(c => c.id === opt.id) : null
          setClient(cli ?? null)
        }}
        placeholder="Selecciona un cliente…"
        allowNew={false}
      />

      {/* 2) Nombre y semana */}
      <div className="flex gap-4">
        <input
          className="flex-1 rounded bg-zinc-800 p-2 text-white"
          type="text"
          placeholder="Nombre de la rutina"
          value={routineName}
          onChange={e => setRoutineName(e.target.value)}
        />
        <input
          className="w-20 rounded bg-zinc-800 p-2 text-white"
          type="number"
          min={1}
          value={weekNumber}
          onChange={e => setWeekNumber(Number(e.target.value))}
        />
      </div>

      {/* 3) Ejercicios por día */}
      {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'].map((label, idx) => (
        <div key={idx} className="bg-zinc-800 p-4 rounded">
          <h3 className="mb-2 font-semibold text-white">{label}</h3>

          {/* — ENCABEZADO: misma estructura de anchos que las filas — */}
          <div className="flex gap-2 mb-2 text-sm text-gray-300">
            {/* 1) “Ejercicio” ocupa el resto (flex-1) */}
            <div className="flex-1">Ejercicio</div>
            {/* 2) “Repeticiones” con ancho fijo w-24 */}
            <div className="w-24 text-center">Repeticiones</div>
            {/* 3) “Series” con ancho fijo w-16 */}
            <div className="w-16 text-center">Series</div>
            {/* 4) Columna vacía (para el icono de eliminar), ancho w-8 */}
            <div className="w-8">&nbsp;</div>
          </div>

          {/* — FILAS: cada fila usa exactamente las mismas clases de ancho — */}
          {items
            .filter(it => it.day_of_week === idx + 1)
            .sort((a, b) => a.order - b.order)
            .map((it, i) => (
              <div key={i} className="mb-2 flex gap-2 items-center">
                {/* 1) Combobox envuelto en <div className="flex-1">…</div> */}
                <div className="flex-1">
                  <UICombobox
                    options={exercises.map(ex => ({ id: ex.id!, name: ex.name }))}
                    value={{ id: it.exercise.id!, name: it.exercise.name }}
                    onChange={opt => {
                      if (opt) {
                        it.exercise = { id: opt.id, name: opt.name, video_url: '' }
                        setItems([...items])
                      }
                    }}
                    placeholder="Ejercicio…"
                    allowNew={false}
                  />
                </div>

                {/* 2) Input de repeticiones con ancho fijo w-24 */}
                <input
                  className="w-24 rounded bg-zinc-700 p-2 text-white text-center"
                  type="text"
                  placeholder="Reps"
                  value={it.reps_range}
                  onChange={e => {
                    it.reps_range = e.target.value
                    setItems([...items])
                  }}
                />

                {/* 3) Input de series con ancho fijo w-16 */}
                <input
                  className="w-16 rounded bg-zinc-700 p-2 text-white text-center"
                  type="number"
                  value={it.order}
                  onChange={e => {
                    it.order = Number(e.target.value)
                    setItems([...items])
                  }}
                />

                {/* 4) Botón basura (ancho fijo w-8) */}
                <button
                  className="w-8 text-gray-400 hover:text-red-500"
                  onClick={() => {
                    // Eliminamos ese ítem de la lista
                    setItems(prev =>
                      prev.filter(x => x !== it)
                    )
                  }}
                  type="button"
                >
                  🗑
                </button>
              </div>
          ))}

          {/* Botón para añadir nuevo ejercicio a este día */}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => addEmptyItem(idx + 1)}
          >
            + Añadir ejercicio
          </Button>
        </div>
      ))}

      <div className="text-right">
        <Button onClick={saveRoutine}>Guardar rutina</Button>
      </div>
    </div>
  )
}
