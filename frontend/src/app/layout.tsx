// frontend/src/app/layout.tsx
import './global.css'
import Providers from '@/components/Providers'
import Header    from '@/components/Header'

export const metadata = { title: 'El Bajo Entrena' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script src="https://sdk.mercadopago.com/js/v2" async></script>
      </head>
      <body className="…">
        <div className="…bg-image…"/>
        <Providers>
          <Header />
          <main className="mx-auto max-w-5xl p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
