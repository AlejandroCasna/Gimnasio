'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import MamushkaNav from '@/components/MamushkaNav'
import NewsCarousel from '@/components/NewsCarousel'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function Dashboard() {
  const [showNav, setShowNav] = useState(false)

  // Las imágenes que usabas para el carrusel (si lo necesitas):
  const slides = [
    { src: '/1.jpg', alt: 'Noticia A' },
    { src: '/2.jpg', alt: 'Noticia B' },
    { src: '/3.jpg', alt: 'Noticia C' },
    { src: '/4.png', alt: 'Noticia C' },
    { src: '/5.png', alt: 'Noticia C' },
  ]

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-screen-xl px-4 py-16">
        {/* Botón que actúa como encabezado desplegable */}
        <button
         onClick={() => setShowNav(prev => !prev)}
         className="w-full flex items-center justify-center gap-2 text-2xl font-bold mb-6 focus:outline-none"
       >
         ELIGE TU PLAN
         {showNav ? (
           <ChevronUp className="w-6 h-6" />
         ) : (
           <ChevronDown className="w-6 h-6" />
         )}
       </button>

        {/* Aquí renderizas MamushkaNav solo si showNav === true */}
        {showNav && (
          <div className="mb-8">
            <MamushkaNav />
          </div>
        )}
      </section>

      {/* Si sigues necesitando el carrusel de noticias, mantenlo aquí. */}
      {/* Si ya no usas NewsCarousel, puedes eliminar todo esto. */}
      <div className="w-full py-8">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">
          Noticias del día
        </h3>
        <div className="mx-auto max-w-screen-2xl px-4">
          <NewsCarousel images={slides} intervalMs={5000} slidesToShow={5} />
          
        </div>
      </div>
    </>
  )
}
