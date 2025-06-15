
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
    console.log('🔍 [useSupabaseEvents] Iniciando busca por eventos aprovados...');
    setLoading(true);
    setError(null);
    
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      console.log('📊 [useSupabaseEvents] Resposta da consulta:', { 
        data: eventsData,
        error: eventsError,
        count: eventsData?.length || 0
      });

      if (eventsError) {
        console.error('❌ [useSupabaseEvents] Erro na consulta:', eventsError);
        throw eventsError;
      }

      if (!eventsData) {
        console.log('📭 [useSupabaseEvents] Dados vazios recebidos');
        setEvents([]);
        setLoading(false);
        return;
      }

      console.log('🔄 [useSupabaseEvents] Formatando', eventsData.length, 'eventos...');
      const formattedEvents: EventProps[] = eventsData.map((event) => {
        let socialMedia: SocialMediaLink[] = [];
        
        try {
          if (event.social_media && Array.isArray(event.social_media)) {
            socialMedia = event.social_media.map((item: any) => ({
              id: item.id || `social-${Date.now()}-${Math.random()}`,
              platform: item.platform || '',
              url: item.url || ''
            }));
          }
        } catch (e) {
          console.warn('⚠️ [useSupabaseEvents] Erro ao processar social media para evento', event.id, ':', e);
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
          attendees: 0, // TODO: Implementar contagem real de participantes
          category: event.category,
          image: event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
          socialMedia,
        };
      });
      
      console.log('✅ [useSupabaseEvents] Eventos formatados com sucesso:', formattedEvents.length);
      setEvents(formattedEvents);
      setError(null);
      
    } catch (exception: any) {
      console.error('💥 [useSupabaseEvents] Exceção durante busca:', exception);
      setError(`Erro ao carregar eventos: ${exception.message || exception}`);
      setEvents([]);
    } finally {
      console.log('🏁 [useSupabaseEvents] Finalizando busca, definindo loading = false');
      setLoading(false);
    }
  };

  const createEvent = async (eventData: CreateEventData, creatorId: string, creatorName: string) => {
    console.log('📝 [useSupabaseEvents] Criando evento:', { eventData, creatorId, creatorName });
    
    try {
      const socialMediaJson = eventData.socialMedia ? JSON.parse(JSON.stringify(eventData.socialMedia)) : [];
      
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

      console.log('✅ [useSupabaseEvents] Evento criado:', { data, error });
      return { data, error };
    } catch (exception) {
      console.error('💥 [useSupabaseEvents] Erro ao criar evento:', exception);
      return { data: null, error: exception };
    }
  };

  const getUserEvents = async (userId: string) => {
    console.log('👤 [useSupabaseEvents] Buscando eventos do usuário:', userId);
    
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

      console.log('📊 [useSupabaseEvents] Eventos do usuário:', { data, error, count: data?.length || 0 });
      return { data, error };
    } catch (exception) {
      console.error('💥 [useSupabaseEvents] Erro ao buscar eventos do usuário:', exception);
      return { data: null, error: exception };
    }
  };

  const deleteEvent = async (eventId: string) => {
    console.log('🗑️ [useSupabaseEvents] Deletando evento:', eventId);
    
    try {
      const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      console.log('✅ [useSupabaseEvents] Resultado da deleção:', { data, error });
      return { data, error };
    } catch (exception) {
      console.error('💥 [useSupabaseEvents] Erro ao deletar evento:', exception);
      return { data: null, error: exception };
    }
  };

  useEffect(() => {
    console.log('🚀 [useSupabaseEvents] useEffect disparado - iniciando fetchEvents');
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
