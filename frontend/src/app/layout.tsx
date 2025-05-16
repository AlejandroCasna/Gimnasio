// frontend/src/app/layout.tsx
import './global.css'
import { AuthProvider } from '@/hooks/useAuth'
import Header           from '@/components/Header'

export const metadata = {
  title: 'El Bajo Entrena',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<html lang="es">{/* evita que aparezcan espacios aquí */}
<head/>{/* idem aquí */}
<body
  className="
    min-h-screen
    bg-black
    text-white
    bg-[url('/logo.png')]
    bg-cover
    bg-center
    bg-opacity-20
  "
>
  <AuthProvider>
    <main className="relative z-10 flex-grow">
      {children}
    </main>
  </AuthProvider>
</body>
</html>
  )
}
