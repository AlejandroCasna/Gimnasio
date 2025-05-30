// frontend/src/app/page.tsx
import Hero from '@/components/Hero'
import MamushkaNav from '@/components/MamushkaNav'
// IMPORTA SOLO NewsBanner
import NewsBanner from '@/components/NewsBanner'

export default function Dashboard() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-screen-xl px-4 py-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Elige tu plan
        </h2>
        <MamushkaNav />
      </section>

      {/* ← Aquí sustituyes el viejo NewsCarousel por tu NewsBanner */}
      <NewsBanner />
    </>
  )
}
