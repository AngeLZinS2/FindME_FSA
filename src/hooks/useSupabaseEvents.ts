
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
    console.log('🔍 Iniciando busca por eventos...');
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Buscando eventos com status "approved"...');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('date', { ascending: true });

      console.log('📊 Resultado da consulta:', { data, error });

      if (error) {
        console.error('❌ Erro ao buscar eventos:', error);
        setError(`Erro ao buscar eventos: ${error.message}`);
        setEvents([]);
        return;
      }

      if (!data || data.length === 0) {
        console.log('📭 Nenhum evento aprovado encontrado');
        setEvents([]);
        return;
      }

      console.log(`📈 Eventos encontrados: ${data.length}`);
      
      const formattedEvents: EventProps[] = data.map((event) => {
        console.log('🔄 Formatando evento:', event.title);
        
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
          console.warn('⚠️ Erro ao processar social media:', e);
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
      
      console.log('✅ Eventos formatados:', formattedEvents);
      setEvents(formattedEvents);
      
    } catch (exception) {
      console.error('💥 Exceção ao buscar eventos:', exception);
      setError(`Exceção: ${exception}`);
      setEvents([]);
    } finally {
      setLoading(false);
      console.log('🏁 Busca finalizada, loading=false');
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
    console.log('🚀 useEffect disparado - iniciando fetchEvents');
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
