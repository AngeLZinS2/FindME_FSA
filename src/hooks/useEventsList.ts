
import { useSupabaseEvents } from './useSupabaseEvents';

export const useEventsList = () => {
  console.log('🎯 useEventsList chamado');
  const result = useSupabaseEvents();
  console.log('🎯 useEventsList retornando:', { 
    eventsCount: result.events.length, 
    loading: result.loading 
  });
  return result;
};
