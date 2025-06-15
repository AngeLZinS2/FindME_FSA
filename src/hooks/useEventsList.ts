
import { useSupabaseEvents } from './useSupabaseEvents';

export const useEventsList = () => {
  const { events, loading, error, fetchEvents, createEvent, getUserEvents, deleteEvent } = useSupabaseEvents();
  
  console.log('🎯 useEventsList - Status:', { 
    eventCount: events.length, 
    loading,
    hasError: !!error,
    error
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
