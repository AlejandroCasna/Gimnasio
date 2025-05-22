// frontend/src/components/MamushkaNav.tsx
'use client'

import { useState, useEffect, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, MapPin } from 'lucide-react'
import Image from 'next/image'

interface Node {
  label: ReactNode
  children?: Node[]
  qrKey?: string          // clave para el QR
}

export default function MamushkaNav() {
  // — estado de la pila de menús
  const [stack, setStack]      = useState<Node[][]>([])
  // — estado de la clave del QR a mostrar
  const [modalQR, setModalQR]  = useState<string| null>(null)

  // — definición del árbol de opciones
  const tree: Node[] = [
    {
      label: 'Entrenamiento presencial Grupal',
      children: [
        {
          label: (
            <div className="flex items-center justify-between">
              <span>Punta chica</span>
              <a
                href="https://www.google.com/maps/place/EL+BAJO+ENTRENA+punta+chica/@-34.4447507,-58.5344109,17z/data=!4m6!3m5!1s0x95bcafefb1fa4c31:0xea59586d8e3760fb!8m2!3d-34.4447507!4d-58.5344109!16s%2Fg%2F11h0lbdfyl?entry=ttu&g_ep=EgoyMDI1MDUxNS4wIKXMDSoASAFQAw%3D%3D"
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
                href="https://www.google.com/maps/place/EL+BAJO+ENTRENA+punta+chica/@-34.4447507,-58.5344109,17z/data=!4m6!3m5!1s0x95bcafefb1fa4c31:0xea59586d8e3760fb!8m2!3d-34.4447507!4d-58.5344109!16s%2Fg%2F11h0lbdfyl?entry=ttu&g_ep=EgoyMDI1MDUxNS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="text-red-600 hover:text-red-800"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </div>
          ) as ReactNode,
          // si aquí tuvieras qrKey podrías abrirlo directamente
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

  // — inicializar pila al montar
  useEffect(() => {
    setStack([tree])
  }, [])

  const current = stack[stack.length - 1] || []

  // — al hacer click en un nodo
  function push(node: Node) {
    if (node.qrKey) {
      // abre el modal con el QR estático en public/qrcodes/{qrKey}.png
      setModalQR(`/qrcodes/${node.qrKey}.png`)
      return
    }
    if (node.children) {
      setStack(s => [...s, node.children!])
    }
  }

  // — volver atrás
  function pop() {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : s))
  }

  return (
    <>
      {stack.length > 1 && (
        <Button
          variant="ghost"
          size="icon"
          onClick={pop}
          className="mb-2"
        >
          <ChevronLeft />
        </Button>
      )}

      <div className="grid grid-cols-1 gap-2 mb-4">
        {current.map((n, i) => (
          <Button key={i} onClick={() => push(n)} className="w-full">
            {n.label}
          </Button>
        ))}
      </div>

      {modalQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setModalQR(null)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              Escanea este QR para pagar
            </h2>
            <Image
              src={modalQR}
              alt="Código QR de pago"
              width={300}
              height={300}
              className="mx-auto"
            />
            <Button className="mt-4 w-full" onClick={() => setModalQR(null)}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
