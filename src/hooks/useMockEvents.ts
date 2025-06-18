
import { useState, useEffect } from 'react';
import { mockEvents, MockEvent } from '@/data/mockData';

interface CreateEventData {
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
}

export const useMockEvents = () => {
  const [events, setEvents] = useState<MockEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const savedEvents = localStorage.getItem('mockEvents');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      } else {
        setEvents(mockEvents);
        localStorage.setItem('mockEvents', JSON.stringify(mockEvents));
      }
    } catch (err) {
      setError('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData, creatorId: string, creatorName: string) => {
    try {
      const newEvent: MockEvent = {
        id: Date.now().toString(),
        ...eventData,
        creator_id: creatorId,
        creator_name: creatorName,
        status: 'approved', // Aprovar automaticamente para demo
        socialMedia: eventData.socialMedia || []
      };

      const savedEvents = localStorage.getItem('mockEvents');
      const currentEvents = savedEvents ? JSON.parse(savedEvents) : mockEvents;
      const updatedEvents = [newEvent, ...currentEvents];
      
      localStorage.setItem('mockEvents', JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      
      return { data: newEvent, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const getUserEvents = async (userId: string) => {
    const savedEvents = localStorage.getItem('mockEvents');
    const currentEvents = savedEvents ? JSON.parse(savedEvents) : mockEvents;
    const userEvents = currentEvents.filter((event: MockEvent) => event.creator_id === userId);
    
    return { data: userEvents, error: null };
  };

  const deleteEvent = async (eventId: string) => {
    const savedEvents = localStorage.getItem('mockEvents');
    const currentEvents = savedEvents ? JSON.parse(savedEvents) : mockEvents;
    const updatedEvents = currentEvents.filter((event: MockEvent) => event.id !== eventId);
    
    localStorage.setItem('mockEvents', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    
    return { data: null, error: null };
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    getUserEvents,
    deleteEvent,
  };
};
