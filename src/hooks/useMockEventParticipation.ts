
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useMockEventParticipation = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const joinEvent = async (eventId: string, userId: string) => {
    console.log('🎯 [useMockEventParticipation] Simulando participação no evento:', { eventId, userId });
    setLoading(true);

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Simular verificação de participação existente
      const existingParticipations = JSON.parse(localStorage.getItem('eventParticipations') || '[]');
      const alreadyJoined = existingParticipations.some((p: any) => p.eventId === eventId && p.userId === userId);

      if (alreadyJoined) {
        toast({
          title: "Já participando",
          description: "Você já está participando deste evento.",
        });
        return { success: false, alreadyJoined: true };
      }

      // Adicionar participação
      existingParticipations.push({ eventId, userId, joinedAt: new Date().toISOString() });
      localStorage.setItem('eventParticipations', JSON.stringify(existingParticipations));

      toast({
        title: "Participação confirmada!",
        description: "Você foi registrado para este evento com sucesso.",
      });

      return { success: true };
    } catch (error) {
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
    console.log('🚪 [useMockEventParticipation] Saindo do evento:', { eventId, userId });
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      const existingParticipations = JSON.parse(localStorage.getItem('eventParticipations') || '[]');
      const updatedParticipations = existingParticipations.filter((p: any) => !(p.eventId === eventId && p.userId === userId));
      localStorage.setItem('eventParticipations', JSON.stringify(updatedParticipations));

      toast({
        title: "Participação cancelada",
        description: "Você não está mais participando deste evento.",
      });

      return { success: true };
    } catch (error) {
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
      const existingParticipations = JSON.parse(localStorage.getItem('eventParticipations') || '[]');
      return existingParticipations.some((p: any) => p.eventId === eventId && p.userId === userId);
    } catch (error) {
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
