// frontend/src/app/dashboard/layout.tsx
import Header from '@/components/Header'
import { headers } from 'next/headers'

export const metadata = {
  title: 'Dashboard – El Bajo Entrena'
}

headers
export default function DashboardLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col
                    bg-[url('/logo.png')] bg-center bg-cover
                    before:absolute before:inset-0 before:bg-black/70">

      <main className="relative z-10 flex-grow p-8">
        {children}
      </main>
    </div>
  )
}
