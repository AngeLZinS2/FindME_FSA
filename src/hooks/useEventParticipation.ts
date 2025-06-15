
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEventParticipation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const joinEvent = async (eventId: string, userId: string) => {
    console.log('🎯 [useEventParticipation] Tentando participar do evento:', { eventId, userId });
    setLoading(true);

    try {
      // Verificar se o usuário já está participando
      const { data: existingAttendee, error: checkError } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ [useEventParticipation] Erro ao verificar participação:', checkError);
        throw checkError;
      }

      if (existingAttendee) {
        console.log('⚠️ [useEventParticipation] Usuário já está participando');
        toast({
          title: "Já participando",
          description: "Você já está participando deste evento.",
        });
        return { success: false, alreadyJoined: true };
      }

      // Verificar se ainda há vagas
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('capacity')
        .eq('id', eventId)
        .single();

      if (eventError) {
        console.error('❌ [useEventParticipation] Erro ao buscar evento:', eventError);
        throw eventError;
      }

      const { count: currentAttendees, error: countError } = await supabase
        .from('event_attendees')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId);

      if (countError) {
        console.error('❌ [useEventParticipation] Erro ao contar participantes:', countError);
        throw countError;
      }

      if (currentAttendees >= event.capacity) {
        console.log('⚠️ [useEventParticipation] Evento lotado');
        toast({
          variant: "destructive",
          title: "Evento lotado",
          description: "Não há mais vagas disponíveis para este evento.",
        });
        return { success: false, isFull: true };
      }

      // Adicionar participante
      const { error: insertError } = await supabase
        .from('event_attendees')
        .insert({
          event_id: eventId,
          user_id: userId
        });

      if (insertError) {
        console.error('❌ [useEventParticipation] Erro ao adicionar participante:', insertError);
        throw insertError;
      }

      console.log('✅ [useEventParticipation] Participação registrada com sucesso');
      toast({
        title: "Participação confirmada!",
        description: "Você foi registrado para este evento com sucesso.",
      });

      return { success: true };

    } catch (error) {
      console.error('💥 [useEventParticipation] Erro:', error);
      toast({
        variant: "destructive",
        title: "Erro ao participar",
        description: "Não foi possível registrar sua participação. Tente novamente.",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const leaveEvent = async (eventId: string, userId: string) => {
    console.log('🚪 [useEventParticipation] Saindo do evento:', { eventId, userId });
    setLoading(true);

    try {
      const { error } = await supabase
        .from('event_attendees')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', userId);

      if (error) {
        console.error('❌ [useEventParticipation] Erro ao sair do evento:', error);
        throw error;
      }

      console.log('✅ [useEventParticipation] Saída registrada com sucesso');
      toast({
        title: "Participação cancelada",
        description: "Você não está mais participando deste evento.",
      });

      return { success: true };

    } catch (error) {
      console.error('💥 [useEventParticipation] Erro ao sair:', error);
      toast({
        variant: "destructive",
        title: "Erro ao cancelar",
        description: "Não foi possível cancelar sua participação. Tente novamente.",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const checkUserParticipation = async (eventId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_attendees')
        .select('id')
        .eq('event_id', eventId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ [useEventParticipation] Erro ao verificar participação:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('💥 [useEventParticipation] Erro ao verificar participação:', error);
      return false;
    }
  };

  return {
    joinEvent,
    leaveEvent,
    checkUserParticipation,
    loading
  };
};
