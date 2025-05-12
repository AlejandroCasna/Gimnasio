// frontend/src/components/trainer/ListaClientes.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Client } from '@/lib/types';
import FichaCliente from './FichaCliente';

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [seleccionado, setSeleccionado] = useState<Client| null>(null);

  useEffect(() => {
    api.get<Client[]>('/trainer/clients/')
      .then(res => setClientes(res.data))
      .catch(console.error);
  }, []);

  if (seleccionado) {
    return (
      <FichaCliente
        cliente={seleccionado}
        onBack={() => setSeleccionado(null)}
      />
    );
  }

  return (
    <div className="space-y-2">
      {clientes.map(c => (
        <div
          key={c.id}
          className="p-2 bg-zinc-800 rounded hover:bg-zinc-700 cursor-pointer"
          onClick={() => setSeleccionado(c)}
        >
          {c.username} — {c.first_name} {c.last_name}
        </div>
      ))}
    </div>
  );
}
