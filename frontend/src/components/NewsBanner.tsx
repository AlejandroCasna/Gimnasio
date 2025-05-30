// src/components/NewsBanner.tsx
'use client'

import Image from 'next/image'

interface NewsItem {
  id: number
  title: string
  img: string   // e.g. "1.jpg", debe estar en public/
}

const news: NewsItem[] = [
  { id: 1, title: 'Noticia A', img: '1.jpg' },
  { id: 2, title: 'Noticia B', img: '2.jpg' },
  { id: 3, title: 'Noticia C', img: '3.jpg' },
]

export default function NewsBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-900/60 py-8">
      {/* Capa de fondo semitransparente */}
      <div
        className="absolute inset-0 bg-[url('/banner-bg.jpg')] bg-cover bg-center opacity-30"
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 text-center drop-shadow-lg">
          Noticias del día
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map(item => (
            <div
              key={item.id}
              className="relative group overflow-hidden rounded-lg shadow-xl"
            >
              {/* ratio 16:9 (necesitas @tailwindcss/aspect-ratio) */}
              <div className="aspect-w-16 aspect-h-9 w-full">
                <Image
                  src={`/${item.img}`}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Overlay con texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Haz clic para leer más…
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
