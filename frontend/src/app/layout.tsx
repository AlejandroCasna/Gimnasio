// frontend/src/app/layout.tsx
import './global.css'
import Providers from '@/components/Providers'
import Header    from '@/components/Header'

export const metadata = {
  title: 'El Bajo Entrena',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        {/* Cargamos MercadoPago JS v2 */}
        <script
          src="https://sdk.mercadopago.com/js/v2"
          async
        ></script>
      </head>
      <body className="
        min-h-screen bg-white text-zinc-900
        dark:bg-zinc-900 dark:text-white
        transition-colors
      ">
        <div
          className="absolute inset-0 bg-cover bg-center -z-10"
          style={{ backgroundImage: "url('/gimnasio.jpg')" }}
        />
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
