import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventProps } from '@/components/EventCard';
import { SocialMediaLink } from '@/components/SocialMediaInputs';

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
  socialMedia?: SocialMediaLink[];
}

export const useSupabaseEvents = () => {
  // Unique marker to track instance lifecycles
  const hookInstanceId = Math.random().toString(36).slice(2, 8);
  console.log(`[useSupabaseEvents] INSTANCIADO id=${hookInstanceId}`);

  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    console.log('🔍 [useSupabaseEvents] Iniciando busca por eventos aprovados...');
    setLoading(true);
    setError(null);

    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      console.log('📊 [useSupabaseEvents] Resultado da busca:', {
        count: eventsData?.length || 0,
        hasError: !!eventsError,
        firstEvent: eventsData?.[0]?.title || 'Nenhum',
      });

      if (eventsError) {
        setError(`Erro ao buscar eventos: ${eventsError.message}`);
        setEvents([]);
        setLoading(false);
        return;
      }

      // Validar formato da resposta
      if (!Array.isArray(eventsData)) {
        setError('Resposta inesperada do servidor ao buscar eventos.');
        setEvents([]);
        setLoading(false);
        return;
      }

      console.log('🔄 [useSupabaseEvents] Formatando eventos...');
      const formattedEvents: EventProps[] = eventsData.map((event) => {
        let socialMedia = [];
        try {
          if (Array.isArray(event.social_media)) {
            socialMedia = event.social_media.map((item: any) => ({
              id: item.id || `social-${Date.now()}-${Math.random()}`,
              platform: item.platform || '',
              url: item.url || ''
            }));
          }
        } catch (e) {
          socialMedia = [];
        }
        return {
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          date: event.date,
          time: event.time,
          capacity: event.capacity,
          attendees: 0,
          category: event.category,
          image: event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
          socialMedia,
        };
      });

      console.log('✅ [useSupabaseEvents] Eventos formatados:', formattedEvents.length);
      setEvents(formattedEvents);
      setLoading(false);
      console.log('🏁 [useSupabaseEvents] Finalizando busca');
    } catch (exception) {
      setError(`Erro na conexão: ${exception}`);
      setEvents([]);
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData, creatorId: string, creatorName: string) => {
    console.log('useSupabaseEvents createEvent called with:', { eventData, creatorId, creatorName });
    
    try {
      const socialMediaJson = eventData.socialMedia ? JSON.parse(JSON.stringify(eventData.socialMedia)) : [];
      
      console.log('Inserting event into database...');
      
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          date: eventData.date,
          time: eventData.time,
          location: eventData.location,
          category: eventData.category,
          capacity: eventData.capacity,
          price: eventData.price || 0,
          image: eventData.image,
          creator_id: creatorId,
          creator_name: creatorName,
          social_media: socialMediaJson,
          status: 'pending'
        });

      console.log('Database response:', { data, error });
      return { data, error };
    } catch (exception) {
      console.error('Exception in createEvent:', exception);
      return { data: null, error: exception };
    }
  };

  const getUserEvents = async (userId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  };

  const deleteEvent = async (eventId: string) => {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    return { data, error };
  };

  useEffect(() => {
    console.log(`[useSupabaseEvents] useEffect disparado (id=${hookInstanceId}) - iniciando fetchEvents`);
    fetchEvents();
    // Log on cleanup (unmount)
    return () => {
      console.log(`[useSupabaseEvents] HOOK DESTRUIDO (id=${hookInstanceId})`);
    };
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
