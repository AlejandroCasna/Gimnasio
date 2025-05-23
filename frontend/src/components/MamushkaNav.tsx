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
    label: 'Entrenamiento presencial Grupal',
    children: [
      {
        label: (
          <div className="flex items-center justify-between">
            <span>Punta chica</span>
            <a
              href="https://www.google.com/maps?q=EL+BAJO+ENTRENA+punta+chica,+Escalada+2800,+B1646+San+Fernando,+Provincia+de+Buenos+Aires&ftid=0x95bcafefb1fa4c31:0xea59586d8e3760fb&entry=gps&lucs=,94224825,94227247,94227248,94231188,47071704,47069508,94218641,94203019,47084304,94208458,94208447&g_ep=CAISEjI1LjE2LjEuNzQ3NTI2NjMwMBgAINeCAypjLDk0MjI0ODI1LDk0MjI3MjQ3LDk0MjI3MjQ4LDk0MjMxMTg4LDQ3MDcxNzA0LDQ3MDY5NTA4LDk0MjE4NjQxLDk0MjAzMDE5LDQ3MDg0MzA0LDk0MjA4NDU4LDk0MjA4NDQ3QgJBUg%3D%3D&skid=bc6c8387-5c6a-49ce-8fbc-2327b8aad238&g_st=com.google.maps.preview.copy"
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
          { label: '1 vez a la semana – $25.000', qrKey: '1_semana' },
          { label: '2 veces a la semana – $32.000', qrKey: '2_semanas' },
          { label: '3 veces a la semana – $35.000', qrKey: '3_semanas' },
          { label: '4 veces a la semana – $38.000', qrKey: '4_semanas' },
          { label: 'Libre – $42.000',           qrKey: 'libre'     },
        ],
      },
      {
        label: 'Local 2',
        children: [
          { label: '1 vez a la semana – $25.000', qrKey: '1_semana' },
          { label: '2 veces a la semana – $32.000', qrKey: '2_semanas' },
          { label: '3 veces a la semana – $35.000', qrKey: '3_semanas' },
          { label: '4 veces a la semana – $38.000', qrKey: '4_semanas' },
          { label: 'Libre – $42.000',           qrKey: 'libre'     },
        ],
      },
      {
        label: 'Local 3',
        children: [
          { label: '1 vez a la semana – $25.000', qrKey: '1_semana' },
          { label: '2 veces a la semana – $32.000', qrKey: '2_semanas' },
          { label: '3 veces a la semana – $35.000', qrKey: '3_semanas' },
          { label: '4 veces a la semana – $38.000', qrKey: '4_semanas' },
          { label: 'Libre – $42.000',           qrKey: 'libre'     },
        ],
      },
    ],
  },
  {
    label: 'Entrenamiento personalizadas',
    children: [
      {
        label: (
          <div className="flex items-center gap-2">
            <span>Punta chica</span>
            <a
              href="https://www.google.com/maps?q=EL+BAJO+ENTRENA+punta+chica,+Escalada+2800,+B1646+San+Fernando,+Provincia+de+Buenos+Aires&ftid=0x95bcafefb1fa4c31:0xea59586d8e3760fb&entry=gps&lucs=,94224825,94227247,94227248,94231188,47071704,47069508,94218641,94203019,47084304,94208458,94208447&g_ep=CAISEjI1LjE2LjEuNzQ3NTI2NjMwMBgAINeCAypjLDk0MjI0ODI1LDk0MjI3MjQ3LDk0MjI3MjQ4LDk0MjMxMTg4LDQ3MDcxNzA0LDQ3MDY5NTA4LDk0MjE4NjQxLDk0MjAzMDE5LDQ3MDg0MzA0LDk0MjA4NDU4LDk0MjA4NDQ3QgJBUg%3D%3D&skid=bc6c8387-5c6a-49ce-8fbc-2327b8aad238&g_st=com.google.maps.preview.copy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="text-red-600 hover:text-red-800"
            >
              <MapPin className="w-5 h-5" />
            </a>
          </div>
        ) as ReactNode,
      },
      { label: 'Local 2' },
      { label: 'Local 3' },
    ],
  },
  {
    label: 'Entrenamiento a distancia',
    children: [
      { label: 'Running' },
      { label: 'Fuerza en Gimnasio' },
      { label: 'Híbrido' },
    ],
  },
]

// — Mapa de precios
const PRICE_MAP: Record<string, number> = {
  '1_semana':  25000,
  '2_semanas': 32000,
  '3_semanas': 35000,
  '4_semanas': 38000,
  'libre':     42000,
}

export default function MamushkaNav() {
  // 1) inicializamos stack ya con [tree]
  const [stack,     setStack] = useState<Node[][]>([tree])
  const [selection, setSel]   = useState<{ id: string; amount: number } | null>(null)

  const current = stack[stack.length - 1]  // ¡nunca será undefined!

  const push = (node: Node) => {
    if (node.qrKey) {
      const amount = PRICE_MAP[node.qrKey]
      if (!amount) {
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

  // 2) Si ya elegí plan, muestro el botón de pago
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

  // 3) Menú normal
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
