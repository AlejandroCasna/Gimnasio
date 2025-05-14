// frontend/src/components/trainer/FichaCliente.tsx
'use client';

import { Client } from '@/lib/types';
import { Button } from '@/components/ui/button';
import ClientProfileForm from '@/components/ClientProfileForm';

export default function FichaCliente({
  cliente,
  onBack
}: {
  cliente: Client;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <Button variant="ghost" onClick={onBack}>← Volver</Button>
      <h2 className="text-xl">{cliente.first_name} {cliente.last_name}</h2>
      <p>Email: {cliente.email}</p>
      <p>Teléfono: {cliente.phone}</p>
      <p>Tipo: {cliente.tipo}</p>

      {cliente.tipo === 'grupal' ? (
        // Imagen estática de horarios grupales (imagen 2)
        <img
          src="/horario-grupal-template.png"
          alt="Horario grupal"
          className="w-full rounded shadow"
        />
      ) : (
        // Imagen o tabla de ejemplo personalizado (imagen 1)
        <img
          src="/horario-personalizado-template.png"
          alt="Rutina personalizada"
          className="w-full rounded shadow"
        />
      )}
    </div>
  );
}
