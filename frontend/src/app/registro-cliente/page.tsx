import { Suspense } from 'react'
import RegistroClienteContent from './RegistroClienteContent'

export default function RegistroClientePage() {
  return (
    <Suspense fallback={<p>Cargando...</p>}>
      <RegistroClienteContent />
    </Suspense>
  )
}
