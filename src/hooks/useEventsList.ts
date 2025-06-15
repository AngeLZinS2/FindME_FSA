
import { useSupabaseEvents } from './useSupabaseEvents';

export const useEventsList = () => {
  console.log('🎯 useEventsList chamado');
  const { events, loading, fetchEvents, createEvent, getUserEvents, deleteEvent } = useSupabaseEvents();
  
  console.log('🎯 useEventsList - dados recebidos do useSupabaseEvents:', { 
    eventsCount: events.length, 
    loading,
    events: events
  });
  
  console.log('🎯 useEventsList retornando:', { 
    eventsCount: events.length, 
    loading 
  });
  
  return {
    events,
    loading,
    fetchEvents,
    createEvent,
    getUserEvents,
    deleteEvent,
  };
};
