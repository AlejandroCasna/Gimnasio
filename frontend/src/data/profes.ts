// frontend/src/data/profes.ts
export interface Profe {
  name:        string
  photo:       string   // ruta pública
  description: string
  whatsapp:    string   
}

export const profes: Profe[] = [
  {
    name: 'Juan Pérez',
    photo: 'entrenador1.jpg',
    description: 'Especialista en running y coaching deportivo.',
    whatsapp: 'https://wa.me/5491134481256'
  },
  {
    name: 'German Bosca',
    photo: 'entrenador2.png',
    description: 'Entrenador personal y nutricionista certificado.',
    whatsapp: 'https://wa.me/34672093147'
  },
  // …añade más profes según necesites
]
