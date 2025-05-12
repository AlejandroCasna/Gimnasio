export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Capa de gradiente para dar color y oscurecer */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/25 via-zinc-900/50 to-zinc-900" />

      {/* LOGO de fondo — esquina izquierda, tamaño 45 % del ancho */}
      <div className="absolute inset-0 bg-no-repeat bg-left bg-[length:25%] opacity-10
                      bg-[url('/logo.png')]" />

      {/* Contenido */}
      <div className="relative mx-auto max-w-5xl py-24 px-4 text-center text-light-100">
        <h1 className="text-5xl font-extrabold drop-shadow">
          Entrena a tu medida
        </h1>
        <p className="mt-4 text-xl">
          Planes presenciales, online y grupales.
        </p>
      </div>
    </section>
  );
}
