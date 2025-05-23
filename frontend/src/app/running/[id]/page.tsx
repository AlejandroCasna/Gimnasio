// frontend/src/app/dashboard/running/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { api } from '@/lib/api'
import type { RunningPlan } from '@/lib/types'
import RunningManager from '@/components/trainer/RunningManager'
import { Button } from '@/components/ui/button'

export default function EditRunningPage() {
  const router = useRouter()
  const path   = usePathname()
  const id     = path.split('/').pop()!

  const [plan, setPlan]     = useState<RunningPlan | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get<RunningPlan>(`/trainer/running-plans/${id}/`)
      .then(res => setPlan(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Cargando…</p>
  if (!plan)  return <p>Plan no encontrado</p>

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Editar Plan de Running</h1>
      <RunningManager clientId={plan.client_id} existingPlan={plan} />
      <Button
        variant="ghost"
        className="mt-4"
        onClick={() => router.back()}
      >
        ← Volver
      </Button>
    </div>
  )
}
