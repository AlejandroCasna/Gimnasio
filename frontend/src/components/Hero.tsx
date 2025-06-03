// src/components/Hero.tsx
'use client'

export default function Hero() {
  return (
    <section
      className="
        relative isolate overflow-hidden
        mx-auto w-full max-w-screen-2xl     /* centrado y ancho máximo */
        rounded-lg shadow-xl                 /* bordes redondeados y sombra */
        h-48 sm:h-64 md:h-80 lg:h-96         /* alturas responsivas: 192px → 384px */
      "
    >
      {/* Capa de gradiente para dar color y oscurecer */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/25 via-zinc-900/50 to-zinc-900" />

      {/* LOGO de fondo — esquina izquierda, tamaño 25 % del ancho */}
      <div
        className="
          absolute inset-0
          bg-no-repeat bg-left
          bg-[length:25%]
          opacity-10
          bg-[url('/logo.png')]
        "
      />

      {/* Contenido centrado verticalmente */}
      <div
        className="
          relative z-10
          flex flex-col items-center justify-center
          h-full px-4
          text-center text-light-100
        "
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold drop-shadow">
          ENTRENA A TU MEDIDA
        </h1>
        <p className="mt-3 text-sm sm:text-base md:text-lg">
          Planes presenciales, online y grupales.
        </p>
      </div>
    </section>
  )
}

