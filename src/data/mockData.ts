
export interface MockUser {
  id: string;
  email: string;
  name: string;
  userType: string;
  phone?: string;
  city?: string;
}

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  price?: number;
  image?: string;
  socialMedia?: any[];
  creator_id: string;
  creator_name: string;
  status: string;
}

export const mockUser: MockUser = {
  id: '1',
  email: 'usuario@exemplo.com',
  name: 'Usuário Exemplo',
  userType: 'creator',
  phone: '(11) 99999-9999',
  city: 'São Paulo'
};

export const mockEvents: MockEvent[] = [
  {
    id: '1',
    title: 'Workshop de React',
    description: 'Aprenda React do básico ao avançado neste workshop intensivo',
    date: '2024-07-15',
    time: '14:00',
    location: 'São Paulo, SP',
    category: 'Tecnologia',
    capacity: 50,
    price: 100,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop',
    socialMedia: [],
    creator_id: '1',
    creator_name: 'Usuário Exemplo',
    status: 'approved'
  },
  {
    id: '2',
    title: 'Show de Rock Nacional',
    description: 'Uma noite especial com as melhores bandas de rock nacional',
    date: '2024-07-20',
    time: '20:00',
    location: 'Rio de Janeiro, RJ',
    category: 'Música',
    capacity: 200,
    price: 50,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2070&auto=format&fit=crop',
    socialMedia: [],
    creator_id: '1',
    creator_name: 'Usuário Exemplo',
    status: 'approved'
  },
  {
    id: '3',
    title: 'Exposição de Arte Moderna',
    description: 'Venha conhecer as obras dos artistas contemporâneos mais promissores',
    date: '2024-07-25',
    time: '10:00',
    location: 'Belo Horizonte, MG',
    category: 'Arte',
    capacity: 100,
    image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?q=80&w=2070&auto=format&fit=crop',
    socialMedia: [],
    creator_id: '1',
    creator_name: 'Usuário Exemplo',
    status: 'approved'
  }
];
