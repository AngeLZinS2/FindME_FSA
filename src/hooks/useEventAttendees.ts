
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEventAttendees = (eventId: string) => {
  const [attendeesCount, setAttendeesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAttendeesCount = async () => {
    console.log('👥 [useEventAttendees] Buscando contagem de participantes para evento:', eventId);
    
    try {
      const { count, error } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);

      if (error) {
        console.error('❌ [useEventAttendees] Erro ao buscar participantes:', error);
        setAttendeesCount(0);
      } else {
        console.log('✅ [useEventAttendees] Participantes encontrados:', count);
        setAttendeesCount(count || 0);
      }
    } catch (error) {
      console.error('💥 [useEventAttendees] Erro:', error);
      setAttendeesCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchAttendeesCount();

      // Configurar realtime para atualizar automaticamente
      const channel = supabase
        .channel(`event_attendees_${eventId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'event_attendees',
            filter: `event_id=eq.${eventId}`
          },
          (payload) => {
            console.log('🔄 [useEventAttendees] Mudança detectada:', payload);
            fetchAttendeesCount();
          }
        )
        .subscribe();

      return () => {
        console.log('🔌 [useEventAttendees] Desconectando do canal realtime');
        supabase.removeChannel(channel);
      };
    }
  }, [eventId]);

  return {
    attendeesCount,
    loading,
    refetch: fetchAttendeesCount
  };
};
