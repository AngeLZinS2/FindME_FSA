
import { useState, useEffect } from 'react';

export const useMockEventAttendees = (eventId: string) => {
  const [attendeesCount, setAttendeesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchAttendeesCount = async () => {
    console.log('👥 [useMockEventAttendees] Buscando contagem de participantes para evento:', eventId);
    
    try {
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const existingParticipations = JSON.parse(localStorage.getItem('eventParticipations') || '[]');
      const count = existingParticipations.filter((p: any) => p.eventId === eventId).length;
      
      console.log('✅ [useMockEventAttendees] Participantes encontrados:', count);
      setAttendeesCount(count);
    } catch (error) {
      console.error('💥 [useMockEventAttendees] Erro:', error);
      setAttendeesCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchAttendeesCount();
    }
  }, [eventId]);

  return {
    attendeesCount,
    loading,
    refetch: fetchAttendeesCount
  };
};
