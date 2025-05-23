// frontend/src/components/PaymentButton.tsx
'use client'

import { useEffect } from 'react'
import { createPreference } from '@/lib/api'

interface Props {
  productId: string
  amount:    number
}

export default function PaymentButton({ productId, amount }: Props) {
  useEffect(() => {
    createPreference({ product_id: productId, amount })
      .then(({ init_point }) => {
        // 1) Abre el checkout de MercadoPago en nueva pestaña
        window.open(init_point, '_blank')
      })
      .catch(err => {
        console.error('No se pudo iniciar el pago:', err)
        alert('No se pudo iniciar el pago.')
      })
  }, [productId, amount])

  // Mientras, mostramos un spinner o mensaje:
  return (
    <div className="w-full h-64 flex items-center justify-center">
      <p className="text-lg">Redirigiendo al pago…</p>
    </div>
  )
}
