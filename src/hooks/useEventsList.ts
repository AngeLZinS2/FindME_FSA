
import { useSupabaseEvents } from './useSupabaseEvents';

export const useEventsList = () => {
  const { events, loading, error, fetchEvents, createEvent, getUserEvents, deleteEvent } = useSupabaseEvents();
  
  console.log('🎯 [useEventsList] Status atual:', { 
    eventCount: events?.length || 0, 
    loading,
    hasError: !!error,
    errorMessage: error
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
