// frontend/src/components/ProfeCard.tsx
import Image from 'next/image'
import { Profe } from '@/data/profes'

export function ProfeCard({ profe }: { profe: Profe }) {
  return (
    <a
      href={profe.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="flex flex-col items-center p-4">
        <Image
          src={profe.photo}
          alt={profe.name}
          width={120}
          height={120}
          className="rounded-full"
        />
        <h3 className="mt-2 font-semibold text-lg">{profe.name}</h3>
        <p className="mt-1 text-sm text-center text-gray-600">{profe.description}</p>
      </div>
    </a>
  )
}
