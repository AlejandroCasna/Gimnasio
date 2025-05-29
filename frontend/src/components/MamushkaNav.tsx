// frontend/src/components/MamushkaNav.tsx
'use client'

import { useState, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, MapPin } from 'lucide-react'
import PaymentButton from './PaymentButton'

interface Node {
  label:    ReactNode
  children?: Node[]
  qrKey?:   string
}

// — Tu árbol de opciones
const tree: Node[] = [
  {
    label: <span className="font-lato">Entrenamiento presencial Grupal</span>,
    children: [
      {
        label: (
          <div className="flex items-center justify-between font-lato">
            <span>Punta chica</span>
            <a
              href="https://www.google.com/maps/place/EL+BAJO+ENTRENA+punta+chica/@-34.4447507,-58.5344109,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcafefb1fa4c31:0xea59586d8e3760fb!8m2!3d-34.4447507!4d-58.5344109!16s%2Fg%2F11h0lbdfyl?entry=ttu&g_ep=EgoyMDI1MDUyNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-red-600 hover:text-red-800"
            >
              <MapPin className="w-5 h-5" />
            </a>
          </div>
        ) as ReactNode,
        children: [
          { label: '1 vez a la semana', children: [{ label: '$25.000', qrKey: '1_semana' }] },
          { label: '2 veces a la semana', children: [{ label: '$32.000', qrKey: '2_semanas' }] },
          { label: '3 veces a la semana', children: [{ label: '$35.000', qrKey: '3_semanas' }] },
          { label: '4 veces a la semana', children: [{ label: '$38.000', qrKey: '4_semanas' }] },
          { label: 'Libre', children: [{ label: '$42.000', qrKey: 'libre' }] },
        ]
      },
      {
        label: <span className="font-lato">Local 2</span>,
        children: [
          { label: '1 vez a la semana', children: [{ label: '$25.000', qrKey: '1_semana' }] },
          { label: '2 veces a la semana', children: [{ label: '$32.000', qrKey: '2_semanas' }] },
          { label: '3 veces a la semana', children: [{ label: '$35.000', qrKey: '3_semanas' }] },
          { label: '4 veces a la semana', children: [{ label: '$38.000', qrKey: '4_semanas' }] },
          { label: 'Libre', children: [{ label: '$42.000', qrKey: 'libre' }] },
        ]
      },
      {
        label: <span className="font-lato">Local 3</span>,
        children: [
          { label: '1 vez a la semana', children: [{ label: '$25.000', qrKey: '1_semana' }] },
          { label: '2 veces a la semana', children: [{ label: '$32.000', qrKey: '2_semanas' }] },
          { label: '3 veces a la semana', children: [{ label: '$35.000', qrKey: '3_semanas' }] },
          { label: '4 veces a la semana', children: [{ label: '$38.000', qrKey: '4_semanas' }] },
          { label: 'Libre', children: [{ label: '$42.000', qrKey: 'libre' }] },
        ]
      },
    ]
  },
  {
    label: <span className="font-lato">Entrenamiento personalizado</span>,
    children: [
      {
        label: (
          <div className="flex items-center gap-2 font-lato">
            <span>Punta chica</span>
            <a
              href="https://www.google.com/maps/place/EL+BAJO+ENTRENA+punta+chica/@-34.4447507,-58.5344109,17z/data=!3m1!4b1!4m6!3m5!1s0x95bcafefb1fa4c31:0xea59586d8e3760fb!8m2!3d-34.4447507!4d-58.5344109!16s%2Fg%2F11h0lbdfyl?entry=ttu&g_ep=EgoyMDI1MDUyNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-red-600 hover:text-red-800"
            >
              <MapPin className="w-5 h-5" />
            </a>
          </div>
        ) as ReactNode,
        children: [
          { label: '1 vez a la semana', children: [{ label: '$25.000', qrKey: '1_semana' }] },
          { label: '2 veces a la semana', children: [{ label: '$32.000', qrKey: '2_semanas' }] },
          { label: '3 veces a la semana', children: [{ label: '$35.000', qrKey: '3_semanas' }] },
          { label: '4 veces a la semana', children: [{ label: '$38.000', qrKey: '4_semanas' }] },
          { label: 'Libre', children: [{ label: '$42.000', qrKey: 'libre' }] },
        ]
      }
    ]
  },
  {
    label: <span className="font-lato">Entrenamiento a distancia</span>,
    children: [
      { label: 'Running', qrKey: 'running' },
      { label: 'Fuerza en Gimnasio', qrKey: 'gimnasio' },
      { label: 'Híbrido', qrKey: 'hibrido' },
    ]
  }
]

// — Mapa de precios
const PRICE_MAP: Record<string, number> = {
  '1_semana':   25000,
  '2_semanas':  32000,
  '3_semanas':  35000,
  '4_semanas':  38000,
  'libre':      42000,
  'running':    20000, // ejemplo
  'gimnasio':   30000, // ejemplo
  'hibrido':    27000, // ejemplo
}

export default function MamushkaNav() {
  const [stack,     setStack] = useState<Node[][]>([tree])
  const [selection, setSel]   = useState<{ id: string; amount: number } | null>(null)

  const current = stack[stack.length - 1]

  const push = (node: Node) => {
    if (node.qrKey) {
      const amount = PRICE_MAP[node.qrKey]
      if (amount == null) {
        console.error('Falta precio para', node.qrKey)
        return
      }
      return setSel({ id: node.qrKey, amount })
    }
    if (node.children) {
      setStack(s => [...s, node.children!])
    }
  }

  const pop = () => {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : s))
  }

  if (selection) {
    return (
      <div className="mb-4">
        <PaymentButton
          productId={selection.id}
          amount={selection.amount}
        />
        <Button variant="ghost" className="mt-2" onClick={() => setSel(null)}>
          ← Volver
        </Button>
      </div>
    )
  }

  return (
    <>
      {stack.length > 1 && (
        <Button variant="ghost" size="icon" onClick={pop} className="mb-2">
          <ChevronLeft />
        </Button>
      )}
      <div className="grid grid-cols-1 gap-2 mb-4">
        {current.map((node, i) => (
          <Button key={i} onClick={() => push(node)} className="w-full">
            {node.label}
          </Button>
        ))}
      </div>
    </>
  )
}