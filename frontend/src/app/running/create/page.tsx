'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'  // tu axios o fetch wrapper

export default function CreateRunning() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [clientId, setClientId] = useState<number>()
  const [segments, setSegments] = useState([{
    day_of_week:1, distance:'', time_min:0, time_sec:0,
    series:1, rest_min:0, rest_sec:0
  }])

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    const payload = {
      name,
      client: clientId,
      segments: segments.map(s => ({
        day_of_week: s.day_of_week,
        distance: parseFloat(s.distance),
        time_minutes: s.time_min,
        time_seconds: s.time_sec,
        series: s.series,
        rest_minutes: s.rest_min,
        rest_seconds: s.rest_sec,
      }))
    }
    await api.post('/running-plans/', payload)
    router.push('/dashboard')  // o a la lista de running
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del plan" required/>
      <input type="number" value={clientId||''} onChange={e=>setClientId(+e.target.value)} placeholder="ID del cliente" required/>
      {segments.map((seg,i)=>(
        <div key={i} className="grid grid-cols-7 gap-2">
          <select value={seg.day_of_week} onChange={e=>{
            const d=+e.target.value
            const copy=[...segments]; copy[i].day_of_week=d; setSegments(copy)
          }}>
            {[1,2,3,4,5,6,7].map(d=>(
              <option key={d} value={d}>
                {['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'][d-1]}
              </option>
            ))}
          </select>
          <input value={seg.distance} onChange={e=>{ const v=e.target.value; const c=[...segments]; c[i].distance=v; setSegments(c)}} placeholder="km"/>
          <input type="number" value={seg.time_min} onChange={e=>{ const v=+e.target.value; const c=[...segments]; c[i].time_min=v; setSegments(c)}} placeholder="min"/>
          <input type="number" value={seg.time_sec} onChange={e=>{ const v=+e.target.value; const c=[...segments]; c[i].time_sec=v; setSegments(c)}} placeholder="seg"/>
          <input type="number" value={seg.series} onChange={e=>{ const v=+e.target.value; const c=[...segments]; c[i].series=v; setSegments(c)}} placeholder="series"/>
          <input type="number" value={seg.rest_min} onChange={e=>{ const v=+e.target.value; const c=[...segments]; c[i].rest_min=v; setSegments(c)}} placeholder="desc min"/>
          <input type="number" value={seg.rest_sec} onChange={e=>{ const v=+e.target.value; const c=[...segments]; c[i].rest_sec=v; setSegments(c)}} placeholder="desc seg"/>
        </div>
      ))}
      <button type="button" onClick={()=>{
        setSegments([...segments, {
          day_of_week:1, distance:'', time_min:0, time_sec:0,
          series:1, rest_min:0, rest_sec:0
        }])
      }}>+ Añadir segmento</button>
      <button type="submit">Guardar Running</button>
    </form>
  )
}
