
import { useState } from "react";
import { EventProps } from "@/components/EventCard";

// Sample data for events
const eventsList: EventProps[] = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description: "Join us for the biggest tech conference of the year featuring industry experts and networking opportunities.",
    location: "São Paulo Convention Center",
    date: "2025-06-15",
    time: "9:00 AM - 5:00 PM",
    capacity: 500,
    attendees: 320,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "2",
    title: "Weekend Music Festival",
    description: "Two days of amazing live music performances from local and international artists.",
    location: "Rio Beach Park",
    date: "2025-07-10",
    time: "4:00 PM - 11:00 PM",
    capacity: 2000,
    attendees: 1950,
    category: "Music",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "3",
    title: "Art Exhibition: Modern Perspectives",
    description: "Explore contemporary art pieces from emerging artists across Brazil.",
    location: "MASP, Av. Paulista",
    date: "2025-05-20",
    time: "10:00 AM - 8:00 PM",
    capacity: 300,
    attendees: 120,
    category: "Art",
    image: "https://images.unsplash.com/photo-1531243420551-511623338314?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "4",
    title: "Coding Bootcamp: Learn Web Development",
    description: "Intensive weekend bootcamp to learn the basics of web development with HTML, CSS and JavaScript.",
    location: "Digital Innovation Center",
    date: "2025-05-24",
    time: "9:00 AM - 6:00 PM",
    capacity: 30,
    attendees: 22,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop"
  },
  {
    id: "5",
    title: "Startup Networking Mixer",
    description: "Connect with founders, investors and startup enthusiasts in a casual networking environment.",
    location: "Innovation Hub",
    date: "2025-05-30",
    time: "6:00 PM - 9:00 PM",
    capacity: 100,
    attendees: 65,
    category: "Networking",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop"
  },
  {
    id: "6",
    title: "Food Festival: Flavors of Brazil",
    description: "Celebrate the rich culinary diversity of Brazil with food stalls, cooking demos and tastings.",
    location: "Municipal Market",
    date: "2025-06-05",
    time: "11:00 AM - 8:00 PM",
    capacity: 1000,
    attendees: 750,
    category: "Food",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2187&auto=format&fit=crop"
  },
  {
    id: "7",
    title: "Football Tournament",
    description: "Annual amateur football tournament with teams from across the city competing for the championship.",
    location: "City Sports Complex",
    date: "2025-06-20",
    time: "9:00 AM - 6:00 PM",
    capacity: 200,
    attendees: 180,
    category: "Sports",
    image: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=2049&auto=format&fit=crop"
  },
  {
    id: "8",
    title: "Photography Workshop",
    description: "Learn professional photography techniques from award-winning photographers.",
    location: "Arts Center",
    date: "2025-07-05",
    time: "10:00 AM - 4:00 PM",
    capacity: 40,
    attendees: 20,
    category: "Art",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "9",
    title: "Brazilian Cuisine Masterclass",
    description: "Learn how to prepare traditional Brazilian dishes from expert chefs.",
    location: "Culinary Institute",
    date: "2025-07-15",
    time: "2:00 PM - 6:00 PM",
    capacity: 25,
    attendees: 15,
    category: "Food",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "10",
    title: "Business Leadership Conference",
    description: "A day of workshops and talks on effective leadership in modern business environments.",
    location: "Executive Business Center",
    date: "2025-08-10",
    time: "8:30 AM - 5:30 PM",
    capacity: 150,
    attendees: 85,
    category: "Networking",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "11",
    title: "Virtual Reality Gaming Expo",
    description: "Try out the latest VR gaming technology and meet game developers.",
    location: "Tech Park Arena",
    date: "2025-08-15",
    time: "11:00 AM - 7:00 PM",
    capacity: 400,
    attendees: 275,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=2012&auto=format&fit=crop"
  },
  {
    id: "12",
    title: "Jazz Night Under the Stars",
    description: "An evening of jazz performances from talented local musicians.",
    location: "Botanical Garden",
    date: "2025-09-05",
    time: "7:00 PM - 11:00 PM",
    capacity: 300,
    attendees: 210,
    category: "Music",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2072&auto=format&fit=crop"
  }
];

export const useEventsList = () => {
  const [events] = useState<EventProps[]>(eventsList);
  
  return {
    events,
  };
};
