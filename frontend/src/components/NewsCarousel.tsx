// frontend/src/components/NewsCarousel.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface NewsCarouselProps {
  images: { src: string; alt: string }[]
  intervalMs?: number
  slidesToShow?: number
}

export default function NewsCarousel({
  images,
  intervalMs = 5000,
  slidesToShow = 3,
}: NewsCarouselProps) {
  const [current, setCurrent] = useState(0)
  const len = images.length

  // cada slide ocupa este % del contenedor
  const slideWidthPercent = 100 / slidesToShow
  const containerWidthPercent = (len * 100) / slidesToShow

  // carrusel automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => {
        const maxIndex = Math.max(0, len - slidesToShow)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, intervalMs)
    return () => clearInterval(timer)
  }, [len, slidesToShow, intervalMs])

  if (len === 0) return null

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-700"
        style={{
          width: `${containerWidthPercent}%`,
          transform: `translateX(-${current * slideWidthPercent}%)`
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative flex-shrink-0"
            style={{ width: `${slideWidthPercent}%` }}
          >
            {/* contenedor de altura fija, ajusta h-48 a lo que necesites */}
            <div className="relative w-full h-48">
              <a
                href={img.src}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-full"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
                />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* botones manuales */}
      <button
        onClick={() => setCurrent(prev => (prev === 0 ? len - slidesToShow : prev - 1))}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ‹
      </button>
      <button
        onClick={() => setCurrent(prev => {
          const maxIndex = Math.max(0, len - slidesToShow)
          return prev >= maxIndex ? 0 : prev + 1
        })}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
      >
        ›
      </button>
    </div>
  )
}
