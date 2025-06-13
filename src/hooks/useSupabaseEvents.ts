
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EventProps } from '@/components/EventCard';

interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  price?: number;
  image?: string;
  socialMedia?: any[];
}

export const useSupabaseEvents = () => {
  const [events, setEvents] = useState<EventProps[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'approved')
      .order('date', { ascending: true });

    if (data && !error) {
      const formattedEvents: EventProps[] = data.map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        date: event.date,
        time: event.time,
        capacity: event.capacity,
        attendees: 0, // We'll need to count from event_attendees table
        category: event.category,
        image: event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
        socialMedia: event.social_media || [],
      }));
      setEvents(formattedEvents);
    } else if (error) {
      console.error('Error fetching events:', error);
    }
    setLoading(false);
  };

  const createEvent = async (eventData: CreateEventData, creatorId: string, creatorName: string) => {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        category: eventData.category,
        capacity: eventData.capacity,
        price: eventData.price || 0,
        image: eventData.image,
        creator_id: creatorId,
        creator_name: creatorName,
        social_media: eventData.socialMedia || [],
        status: 'pending'
      });

    return { data, error };
  };

  const getUserEvents = async (userId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  };

  const deleteEvent = async (eventId: string) => {
    const { data, error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    return { data, error };
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    fetchEvents,
    createEvent,
    getUserEvents,
    deleteEvent,
  };
};
