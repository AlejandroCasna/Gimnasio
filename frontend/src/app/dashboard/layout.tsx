// frontend/src/app/dashboard/layout.tsx
import React from 'react'
import Header from '@/components/Header'

export const metadata = {
  title: 'Dashboard – El Bajo Entrena'
}

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="
        relative min-h-screen flex flex-col
        bg-[url('/logo.png')] bg-center bg-cover
        before:absolute before:inset-0 before:bg-black/70
      "
    >
      {/* Header encima del background */}
      <Header />

      {/* Contenedor de contenido, por encima del velo */}
      <main className="relative z-10 flex-grow p-8">
        {children}
      </main>
    </div>
  )
}
