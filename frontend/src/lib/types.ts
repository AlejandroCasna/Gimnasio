// frontend/src/lib/types.ts

export interface Client {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    tipo: 'distancia' | 'presencial' | 'grupal';
  }
  