// frontend/src/app/profes/page.tsx
import { profes } from '@/data/profes'
import { ProfeCard } from '@/components/ProfeCard'

export default function ProfesPage() {
  return (
    <main className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Nuestros Profesionales</h1>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {profes.map((p, i) => (
          <ProfeCard key={i} profe={p} />
        ))}
      </section>
    </main>
  )
}
