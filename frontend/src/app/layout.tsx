// frontend/src/app/layout.tsx
import './globals.css'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className="
          min-h-screen
          bg-black
          bg-[url('/logo.png')]
          bg-center
          bg-no-repeat
          bg-contain
          text-white
        "
      >


        {children}
      </body>
    </html>
  )
}
