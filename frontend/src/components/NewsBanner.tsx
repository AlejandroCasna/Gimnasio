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
    <section className="w-full bg-[url('/banner-bg.jpg')] bg-cover bg-center py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Noticias del día
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map(item => (
            <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-xl">
              {/* Imagen grande */}
              <div className="relative h-64 w-full">
                <Image
                  src={`/${item.img}`}    // OJO: la slash inicial es clave
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {/* Overlay con texto */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-lg text-white font-semibold">
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
