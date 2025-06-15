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
      console.log('🔍 [STEP 2] Configurando consulta Supabase...');
      
      // Primeiro vamos testar uma consulta simples para ver se há conexão
      console.log('🔍 [STEP 3] Testando conexão com Supabase...');
      const { data: testData, error: testError } = await Promise.race([
        supabase.from('events').select('count', { count: 'exact' }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na consulta de teste')), 10000)
        )
      ]) as any;

      console.log('📊 [STEP 4] Resultado do teste de conexão:', { testData, testError });

      if (testError) {
        console.error('❌ [STEP 4-ERROR] Erro na conexão:', testError);
        setError(`Erro de conexão: ${testError.message}`);
        setEvents([]);
        return;
      }

      console.log('✅ [STEP 5] Conexão OK. Buscando todos os eventos primeiro...');
      
      // Buscar todos os eventos primeiro para debug
      const { data: allEvents, error: allError } = await Promise.race([
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout na busca de todos eventos')), 15000)
        )
      ]) as any;

      console.log('📊 [STEP 6] Todos os eventos:', { 
        count: allEvents?.length || 0, 
        events: allEvents?.slice(0, 3) || [], 
        error: allError 
      });

      if (allError) {
        console.error('❌ [STEP 6-ERROR] Erro ao buscar todos eventos:', allError);
        setError(`Erro ao buscar eventos: ${allError.message}`);
        setEvents([]);
        return;
      }

      console.log('🔍 [STEP 7] Filtrando eventos aprovados...');
      const approvedEvents = allEvents?.filter(event => event.status === 'approved') || [];
      console.log('📊 [STEP 8] Eventos aprovados encontrados:', approvedEvents.length);

      if (approvedEvents.length === 0) {
        console.log('📭 [STEP 9] Nenhum evento aprovado encontrado');
        setEvents([]);
        return;
      }

      console.log('🔄 [STEP 10] Formatando eventos...');
      const formattedEvents: EventProps[] = approvedEvents.map((event, index) => {
        console.log(`🔄 [STEP 10.${index + 1}] Formatando evento:`, event.title);
        
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
          console.warn(`⚠️ [STEP 10.${index + 1}] Erro ao processar social media:`, e);
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
      
      console.log('✅ [STEP 11] Eventos formatados com sucesso:', formattedEvents.length);
      setEvents(formattedEvents);
      
    } catch (exception) {
      console.error('💥 [EXCEPTION] Exceção ao buscar eventos:', exception);
      setError(`Exceção: ${exception}`);
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
