'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface Node {
  label: string;
  children?: Node[];
  onSelect?: () => void;
}

export default function MamushkaNav() {
  // ── 1) Hooks de estado ─────────────────────────────────────────
  const [selectedPhone, setSelectedPhone] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // ── 2) Definimos el árbol **DESPUÉS** de los hooks para poder usar setModalOpen y setSelectedPhone ───
  const tree: Node[] = [
    {
      label: 'Entrenamiento presencial Grupal',
      children: [
        { label: 'Mensual', onSelect: () => console.log('Presencial Mensual') },
        { label: 'Trimestral', onSelect: () => console.log('Presencial Trimestral') },
      ],
    },
    {
      label: 'Entrenamiento personales personalizadas',
      children: [
        { label: 'Local 1', onSelect: () => console.log('Local 1') },
        { label: 'Local 2', onSelect: () => console.log('Local 2') },
        {
          label: 'Local 3',
          children: [
            { label: 'Madrid', onSelect: () => console.log('Madrid') },
            { label: 'Barcelona', onSelect: () => console.log('Barcelona') },
          ],
        },
      ],
    },
    {
      label: 'Entrenamiento personalizado a distancia',
      children: [
        {
          label: 'Running',
          onSelect: () => {
            setSelectedPhone('5491134481256');
            setModalOpen(true);
          },
        },
        {
          label: 'Fuerza en Gimnasio',
          onSelect: () => {
            setSelectedPhone('34672093147');
            setModalOpen(true);
          },
        },
        {
          label: 'Híbrido',
          onSelect: () => {
            setSelectedPhone('34672093147');
            setModalOpen(true);
          },
        },
      ],
    },
  ];

  // ── 3) Ahora sí inicializamos la pila de menús con [tree] ─────────
  const [stack, setStack] = useState<Node[][]>([tree]);
  const current = stack[stack.length - 1];

  // ── 4) Funciones de navegación ──────────────────────────────────
  function push(node: Node) {
    if (node.onSelect) node.onSelect();
    if (node.children) setStack((s) => [...s, node.children!]);
  }

  function pop() {
    setStack((s) => (s.length > 1 ? s.slice(0, -1) : s));
  }

  // ── 5) Render ────────────────────────────────────────────────────
  return (
    <>
      {stack.length > 1 && (
        <Button variant="ghost" onClick={pop} size="icon">
          <ChevronLeft />
        </Button>
      )}

      <div className="grid grid-cols-1 gap-2">
        {current.map((n) => (
          <Button key={n.label} onClick={() => push(n)} className="w-full">
            {n.label}
          </Button>
        ))}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg max-w-sm w-full text-center border-4 border-green-600 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera verde */}
            <div className="bg-green-600 p-4">
              <h2 className="text-white text-lg font-semibold">
                ¡Habla directamente conmigo!
              </h2>
            </div>

            {/* Cuerpo blanco */}
            <div className="p-6">
              <p className="mb-6 text-gray-700">
                Haz clic en WhatsApp para escribirme ahora
              </p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors"
                onClick={() => window.open(`https://wa.me/${selectedPhone}`, '_blank')}
              >
                WhatsApp
              </button>
            </div>

            {/* Pie con cerrar */}
            <div className="border-t border-gray-200 p-4">
              <button
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => setModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
