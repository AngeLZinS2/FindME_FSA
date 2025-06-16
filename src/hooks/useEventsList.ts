
import { useSupabaseEvents } from './useSupabaseEvents';
import { useRef, useEffect } from 'react';

export const useEventsList = () => {
  const { events, loading, error, fetchEvents, createEvent, getUserEvents, deleteEvent } = useSupabaseEvents();
  const initializedRef = useRef(false);
  
  // Evitar múltiplas chamadas de fetchEvents
  useEffect(() => {
    if (!initializedRef.current) {
      console.log('🎯 [useEventsList] First initialization - fetching events');
      initializedRef.current = true;
    }
  }, []);
  
  console.log('🎯 [useEventsList] Status:', { 
    eventCount: events.length, 
    loading,
    hasError: !!error
  });
  
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
