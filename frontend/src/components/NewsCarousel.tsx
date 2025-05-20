// frontend/src/components/NewsCarousel.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface NewsCarouselProps {
  images: { src: string; alt: string }[]
  intervalMs?: number
  slidesToShow?: number  // cuántas imágenes se ven a la vez
}

export default function NewsCarousel({
  images,
  intervalMs = 5000,
  slidesToShow = 3,
}: NewsCarouselProps) {
  const [current, setCurrent] = useState(0)
  const len = images.length

  // auto‐slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => {
        // avanzamos 1, pero sin pasarnos del último slide “visible”
        const maxIndex = Math.max(0, len - slidesToShow)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, intervalMs)
    return () => clearInterval(timer)
  }, [len, slidesToShow, intervalMs])

  if (len === 0) return null

  // ancho total del flex container
  const slideWidthPercent = 100 / slidesToShow
  const containerWidthPercent = (len * 100) / slidesToShow

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
            style={{
              width: `${slideWidthPercent}%`,
              aspectRatio: '16 / 9'
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={i === current}
            />
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
