// src/components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* 1) Gradient de color oscuro: quítalo */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-red-600/25 via-zinc-900/50 to-zinc-900" /> */}

      {/* 2) Logo en background — lo puedes dejar si lo quieres muy sutil */}
      <div className="absolute inset-0 bg-no-repeat bg-left bg-[length:25%] opacity-10 bg-[url('/logo.png')]" />

      {/* 3) Contenido SIN fondo */}
      <div className="relative mx-auto max-w-5xl py-24 px-4 text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
          Entrena a tu medida
        </h1>
        <p className="mt-4 text-xl text-white">
          Planes presenciales, online y grupales.
        </p>
      </div>
    </section>
  )
}
