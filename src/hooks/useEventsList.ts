
import { useSupabaseEvents } from './useSupabaseEvents';

export const useEventsList = () => {
  const { events, loading, error, fetchEvents, createEvent, getUserEvents, deleteEvent } = useSupabaseEvents();
  
  console.log('🎯 [useEventsList] Status atual:', { 
    eventCount: events.length, 
    loading,
    hasError: !!error,
    error: error ? error.substring(0, 100) + '...' : null
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
