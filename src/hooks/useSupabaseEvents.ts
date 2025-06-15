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
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    console.log('🔍 [STEP 1] Iniciando busca por eventos...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 [STEP 2] Buscando eventos aprovados...');
      
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      console.log('📊 [STEP 3] Resultado da busca:', { 
        count: events?.length || 0, 
        events: events?.slice(0, 3) || [], 
        error: eventsError 
      });

      if (eventsError) {
        console.error('❌ [STEP 3-ERROR] Erro ao buscar eventos:', eventsError);
        setError(`Erro ao buscar eventos: ${eventsError.message}`);
        setEvents([]);
        return;
      }

      if (!events || events.length === 0) {
        console.log('📭 [STEP 4] Nenhum evento aprovado encontrado');
        setEvents([]);
        return;
      }

      console.log('🔄 [STEP 5] Formatando eventos...');
      const formattedEvents: EventProps[] = events.map((event, index) => {
        console.log(`🔄 [STEP 5.${index + 1}] Formatando evento:`, event.title);
        
        let socialMedia: SocialMediaLink[] = [];
        try {
          if (Array.isArray(event.social_media)) {
            socialMedia = event.social_media.map((item: any) => ({
              id: item.id || `social-${Date.now()}-${Math.random()}`,
              platform: item.platform || '',
              url: item.url || ''
            }));
          }
        } catch (e) {
          console.warn(`⚠️ [STEP 5.${index + 1}] Erro ao processar social media:`, e);
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
      
      console.log('✅ [STEP 6] Eventos formatados com sucesso:', formattedEvents.length);
      setEvents(formattedEvents);
      
    } catch (exception) {
      console.error('💥 [EXCEPTION] Exceção ao buscar eventos:', exception);
      setError(`Erro na conexão: ${exception}`);
      setEvents([]);
    } finally {
      console.log('🏁 [FINAL] Finalizando busca, setting loading=false');
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
    console.log('🚀 [INIT] useEffect disparado - iniciando fetchEvents');
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
