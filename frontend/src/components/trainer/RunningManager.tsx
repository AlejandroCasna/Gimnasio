// frontend/src/components/trainer/RunningManager.tsx
'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { api } from '@/lib/api'
import { RunningPlan, RunningItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Select } from '@/components/ui/select'

interface Props {
  clientId: number
  existingPlan?: RunningPlan
}

export default function RunningManager({ clientId, existingPlan }: Props) {
  const [plan, setPlan] = useState<RunningPlan>(
    existingPlan || {
      client_id:   clientId,
      week_number: 1,
      name:        '',
      items:       [],
    }
  )
  const [loading, setLoading] = useState(false)

  const addItem = () => {
    setPlan(p => ({
      ...p,
      items: [
        ...p.items,
        {
          day_of_week: 1,
          distance_value: 0,
          distance_unit: 'km',
          work_time: '00:00',
          series: 1,
          rest_time: '00:00',
          training_type: '',
        },
      ],
    }))
  }

  const updateItem = (idx: number, field: keyof RunningItem, value: any) => {
    setPlan(p => {
      const items = [...p.items]
      ;(items[idx] as any)[field] = value
      return { ...p, items }
    })
  }

  const removeItem = (idx: number) => {
    setPlan(p => ({
      ...p,
      items: p.items.filter((_, i) => i !== idx),
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const method = plan.id ? 'put' : 'post'
    const url    = plan.id
      ? `/trainer/running-plans/${plan.id}/`
      : '/trainer/running-plans/'
    api[method]<RunningPlan>(url, plan)
      .then(res => {
        setPlan(res.data)
        alert('Plan guardado correctamente')
      })
      .catch(err => {
        console.error(err)
        alert('Error al guardar plan')
      })
      .finally(() => setLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Nombre del plan</label>
          <Input
            value={plan.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPlan({ ...plan, name: e.target.value })
            }
          />
        </div>
        <div>
          <label>Semana #</label>
          <Input
            type="number"
            value={plan.week_number}
            onChange={e =>
              setPlan({ ...plan, week_number: +e.target.value })
            }
          />
        </div>
      </div>

      <h3 className="font-semibold">Días de Running</h3>
      {plan.items.map((it, i) => (
        <div key={i} className="grid grid-cols-6 gap-2 items-end">
          <div>
            <label>Día</label>
            <Select
              value={it.day_of_week}
              onChange={e => updateItem(i, 'day_of_week', +e.target.value)}
            >
              {[1,2,3,4,5,6,7].map(d => (
                <option key={d} value={d}>
                  {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][d-1]}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label>Distancia</label>
            <Input
              type="number"
              value={it.distance_value}
              onChange={e => updateItem(i, 'distance_value', +e.target.value)}
            />
          </div>
          <div>
            <label>Unidad</label>
            <Select
              value={it.distance_unit}
              onChange={e => updateItem(i, 'distance_unit', e.target.value)}
            >
              <option value="km">km</option>
              <option value="m">m</option>
            </Select>
          </div>
          <div>
            <label>Trabajo</label>
            <Input
              type="text"
              placeholder="mm:ss"
              value={it.work_time}
              onChange={e => updateItem(i, 'work_time', e.target.value)}
            />
          </div>
          <div>
            <label>Series</label>
            <Input
              type="number"
              value={it.series}
              onChange={e => updateItem(i, 'series', +e.target.value)}
            />
          </div>
          <div>
            <label>Descanso</label>
            <Input
              type="text"
              placeholder="mm:ss"
              value={it.rest_time}
              onChange={e => updateItem(i, 'rest_time', e.target.value)}
            />
          </div>
          <div className="col-span-6 text-right">
            <Button
              variant="destructive"
              type="button"
              onClick={() => removeItem(i)}
            >
              Eliminar día
            </Button>
          </div>
        </div>
      ))}

      <Button type="button" onClick={addItem}>
        + Añadir día de running
      </Button>

      <div className="pt-4">
        <Button type="submit" disabled={loading}>
          {plan.id ? 'Actualizar' : 'Crear'} Plan de Running
        </Button>
      </div>
    </form>
  )
}
