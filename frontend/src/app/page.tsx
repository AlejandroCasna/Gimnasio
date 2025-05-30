// frontend/src/app/page.tsx
import Hero from '@/components/Hero'
import MamushkaNav from '@/components/MamushkaNav'
import NewsCarousel from '@/components/NewsCarousel'

 export default function Dashboard() {
   const slides = [
     { src: '/1.jpg', alt: 'Noticia A' },
     { src: '/2.jpg', alt: 'Noticia B' },
     { src: '/3.jpg', alt: 'Noticia C' },
     { src: '/4.png', alt: 'Noticia D' },
     { src: '/5.png', alt: 'Noticia E' },
   ]

   return (
     <>
       <Hero />

       <section className="mx-auto max-w-screen-xl px-4 py-16">
         <h2 className="text-2xl font-bold mb-6 text-center">
           Elige tu plan
         </h2>
         <MamushkaNav />
       </section>

      <div className="w-full bg-zinc-900 py-8">
        <h3 className="text-xl font-semibold text-white mb-4 text-center">
          Noticias del día
        </h3>
        
          <div className="mx-auto max-w-screen-lg px-4">
          <NewsCarousel
           images={slides}
           intervalMs={5000}
           slidesToShow={2}               // muestro 2 al tiempo
           className="mx-auto h-56" 
          />
        </div>
      </div>
     </>
   )
 }
