// frontend/src/data/profes.ts
export interface Profe {
  name:        string
  photo:       string   // ruta pública
  description: string
  whatsapp:    string   // mismo enlace para todos, p.ej. 'https://wa.me/54911XXXXXXX'
}

export const profes: Profe[] = [
  {
    name: 'Juan Pérez',
    photo: 'entrenador1.jpg',
    description: 'Lic. en Educación Física, 5 años de experiencia en entrenamiento funcional.',
    whatsapp: 'https://wa.me/54911XXXXXXX'
  },
  {
    name: 'María Gómez',
    photo: 'entrenador3.jpg',
    description: 'Especialista en running y coaching deportivo.',
    whatsapp: 'https://wa.me/54911XXXXXXX'
  },
  {
    name: 'Luisa Fernández',
    photo: 'entrenador2.png',
    description: 'Entrenadora personal y nutricionista certificada.',
    whatsapp: 'https://wa.me/54911XXXXXXX'
  },
  // …añade más profes según necesites
]
