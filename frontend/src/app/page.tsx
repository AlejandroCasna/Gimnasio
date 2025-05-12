import Header from '@/components/Header';
import Hero from '@/components/Hero';
import MamushkaNav from '@/components/MamushkaNav';

export default function Dashboard() {
  return (
    <>
      <Header />
      <Hero />

      <section className="mx-auto max-w-md px-4 py-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Elige tu plan</h2>
        <MamushkaNav />
      </section>
    </>
  );
}