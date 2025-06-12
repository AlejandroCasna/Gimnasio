// frontend/src/components/BackgroundSlider.tsx
'use client'

import { useState, useEffect } from 'react'

interface BackgroundSliderProps {
  images: string[]      // rutas relativas, ej: ['/images/bg1.jpg', '/images/bg2.jpg']
  intervalMs?: number   // tiempo entre cambios, por defecto 8000ms
}

export default function BackgroundSlider({
  images,
  intervalMs = 8000,
}: BackgroundSliderProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [images.length, intervalMs])

  return (
    <div
      className="fixed inset-0 -z-10 bg-center bg-cover transition-opacity duration-1000"
      style={{ backgroundImage: `url(${images[current]})` }}
    />
  )
}
