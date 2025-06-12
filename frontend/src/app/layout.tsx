// frontend/src/app/layout.tsx
import './global.css'
import Providers from '@/components/Providers'
import Header    from '@/components/Header'
import BackgroundSlider from '@/components/BackgroundSlider'

export const metadata = { title: 'El Bajo Entrena' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <script src="https://sdk.mercadopago.com/js/v2" async></script>
        <link rel="icon" href="/logo.png" />
      </head>
       <body className="relative bg-light-100 text-foreground">
       {/* — Slider de fondo */}
       <BackgroundSlider
         images={[
           '/images/bg1.jpg',
           '/images/bg2.jpg',
           '/images/bg3.jpg',
         ]}
         intervalMs={10000}
       />
        <Providers>
          <Header />
          <main className="w-full px-4 py-8 lg:px-16">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
