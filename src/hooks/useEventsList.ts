
import { useSupabaseEvents } from './useSupabaseEvents';

export const useEventsList = () => {
  const { events, loading, fetchEvents, createEvent, getUserEvents, deleteEvent } = useSupabaseEvents();
  
  console.log('🎯 useEventsList - eventos recebidos:', { 
    count: events.length, 
    loading,
    events: events.map(e => ({ id: e.id, title: e.title, status: 'approved' }))
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
