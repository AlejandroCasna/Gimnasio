// frontend/src/components/PaymentModal.tsx
'use client'

import QRCode from 'qrcode.react'
import { Button } from '@/components/ui/button'

interface Props {
  url: string
  onClose(): void
}

export default function PaymentModal({ url, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">
          Escanéa este QR para pagar
        </h2>
        <QRCode value={url} size={240} />
        <Button className="mt-4 w-full" onClick={onClose}>
          Cerrar
        </Button>
      </div>
    </div>
  )
}
