
import { useMockEvents } from './useMockEvents';
import { useRef, useEffect } from 'react';

export const useMockEventsList = () => {
  const { events, loading, error, fetchEvents, createEvent, getUserEvents, deleteEvent } = useMockEvents();
  const initializedRef = useRef(false);
  
  useEffect(() => {
    if (!initializedRef.current) {
      console.log('🎯 [useMockEventsList] First initialization - fetching events');
      initializedRef.current = true;
    }
  }, []);
  
  console.log('🎯 [useMockEventsList] Status:', { 
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
