// frontend/src/components/LoginModal.tsx
'use client'

import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import LoginForm from './LoginForm'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handler)
    } else {
      document.removeEventListener('keydown', handler)
    }
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Si clikas el fondo semitransparente, cierra */}
      <div
        className="relative w-full max-w-sm bg-zinc-900 rounded-lg p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Botón de cerrar en la esquina superior */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Contenido: el formulario de login */}
        <LoginForm onClose={onClose} />
      </div>
    </div>,
    document.body
  )
}
