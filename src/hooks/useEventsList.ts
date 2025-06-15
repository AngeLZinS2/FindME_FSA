
import { useSupabaseEvents } from './useSupabaseEvents';

export const useEventsList = () => {
  const eventsHookIdentity = Math.random().toString(36).slice(2, 8);
  console.log(`[useEventsList] HOOK CRIADO id=${eventsHookIdentity}`);
  const { events, loading, error, fetchEvents, createEvent, getUserEvents, deleteEvent } = useSupabaseEvents();

  console.log(`[useEventsList] Status id=${eventsHookIdentity}:`, { 
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
