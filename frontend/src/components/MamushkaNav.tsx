// frontend/src/components/MamushkaNav.tsx
'use client'

import { useState, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, MapPin,X } from 'lucide-react'
import PaymentButton from './PaymentButton'
import { profes, Profe } from '@/data/profes'
import { ProfeCard } from './ProfeCard'
import React from 'react'

interface Node {
  label:    ReactNode
  children?: Node[]
  qrKey?:   string
  url?:     string
}

// — Tu árbol de opciones
const tree: Node[] = [
  {
    label: <span className="font-lato">ENTRENAMIENTO PRESENCIAL GRUPAL</span>,
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
          {
            label: <span className="font-lato">Funcional</span>,
            children: [
              { label: '1 vez a la semana', children: [{ label: '$25.000', qrKey: '1_semana' }] },
              { label: '2 veces a la semana', children: [{ label: '$32.000', qrKey: '2_semanas' }] },
              { label: '3 veces a la semana', children: [{ label: '$35.000', qrKey: '3_semanas' }] },
              { label: '4 veces a la semana', children: [{ label: '$38.000', qrKey: '4_semanas' }] },
              { label: 'Libre', children: [{ label: '$42.000', qrKey: 'libre' }] },
            ]
          },
          {
            label: <span className="font-lato">Running</span>,
            children: [
              { label: '1 vez a la semana',   children: [{ label: '$25.000', qrKey: '1_semana' }] },
              { label: '2 veces a la semana', children: [{ label: '$32.000', qrKey: '2_semanas' }] },
            ]
          },
          {
            label: <span className="font-lato">Mixto</span>,
            children: [
              {
                label: '3 veces a la semana (2 Running + 1 Funcional)',
                qrKey: 'mixto_3'
              },
              {
                label: '4 veces a la semana (2 Running + 2 Funcional)',
                qrKey: 'mixto_4'
              },
              {
                label: 'Libre (Máx 2 Running + Funcional ilimitado)',
                qrKey: 'mixto_libre'
              },
            ]
          },
        ]
      },
      {
        label: <span className="font-lato">La Horqueta</span>,
        url: 'https://wa.me/5491134481256'
      },
      {
        label: <span className="font-lato">VILLANUEVA</span>,
        url: 'https://wa.me/5491134481256'
      },
    ]
  },
  {
    label: <span className="font-lato">ENTRENAMIENTO PERSONALIZADO</span>,
    children: profes.map((prof: Profe) => ({
      // cada profe se renderiza con tu ProfeCard
      label: (
        <ProfeCard
          key={prof.name}
          {...prof}
          profe={prof}
        />
      ),
      // sin qrKey ni route: no hace nada al push
    })),
  },
   {
     label: <span className="font-lato">ENTRENAMIENTO A DISTANCIA</span>,
     children: [{
       label: <span className="font-lato">Running</span>,
       url: 'https://wa.me/5491134481256'    // número 1
     },
     {
       label: <span className="font-lato">Running + Funcional</span>,
       url: 'https://wa.me/5491134481256'    // mismo número 1
     },
     {
       label: <span className="font-lato">Híbrido</span>,
       url: 'https://wa.me/34672093147'    // número 2
     },
     ]
   }
 ]

// — Mapa de precios
const PRICE_MAP: Record<string, number> = {
  '1_semana':  25000,
  '2_semanas': 32000,
  '3_semanas': 35000,
  '4_semanas': 38000,
  'libre':     42000,
  running:     20000,
  gimnasio:    30000,
  hibrido:     27000,
  'mixto_3':     35000,  
  'mixto_libre': 42000,
}

export default function MamushkaNav() {
  const [stack,     setStack]   = useState<Node[][]>([tree])
  const [selection, setSelection] = useState<{ id: string; amount: number } | null>(null)

  const current = stack[stack.length - 1]

  function push(node: Node) {
// 1) Si tiene url: abrir WhatsApp
    if (node.url) {
      window.open(node.url, '_blank')
      return
    }

    // 1) Pago:
    if (node.qrKey) {
      const amount = PRICE_MAP[node.qrKey]!
      return setSelection({ id: node.qrKey, amount })
    }
    // 2) Nuevo nivel:
    if (node.children) {
      setStack(prev => [...prev, node.children!])
    }
  }

  function pop() {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  // Botón MercadoPago
  if (selection) {
    return (
      <div className="mb-4">
        <PaymentButton productId={selection.id} amount={selection.amount} />
        <Button variant="ghost" className="mt-2" onClick={() => setSelection(null)}>
          ← Volver
        </Button>
      </div>
    )
  }

  return (
    <div className="flex w-full">
      {/* — MENÚ */}
      <div className="flex-1">
        {stack.length > 1 && (
          <Button variant="ghost" size="icon" onClick={pop} className="mb-2">
            <ChevronLeft />
          </Button>
        )}
        <div className="grid grid-cols-1 gap-2 mb-4">
          {current.map((node, i) => {
            // Si el label es tu tarjeta de profe, la sacamos del <Button>
            if (React.isValidElement(node.label) && node.label.type === ProfeCard) {
              return <div key={i}>{node.label}</div>
            }
            // En otro caso, botón normal
            return (
              <Button key={i} onClick={() => push(node)} className="w-full">
                {node.label}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )}