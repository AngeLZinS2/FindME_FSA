
import React from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import EventCard, { EventProps } from "@/components/EventCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

const featuredEvents: EventProps[] = [
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
  }
];

const categoryIcons = [
  { name: "Music", icon: "🎵" },
  { name: "Sports", icon: "⚽" },
  { name: "Technology", icon: "💻" },
  { name: "Food", icon: "🍲" },
  { name: "Art", icon: "🎨" },
  { name: "Networking", icon: "🤝" },
];

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-accent/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Discover <span className="text-findme-accent">Local Events</span> Near You
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Join events, create memorable experiences, and build connections with FindMe.
              </p>
              
              <div className="relative max-w-md">
                <Input 
                  placeholder="Search for events..." 
                  className="pl-10 pr-4 py-6 text-base" 
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/events">Browse All Events</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/create-event">Create Event</Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary to-findme-accent opacity-10 absolute -top-4 -left-4 w-full h-full"></div>
                <div className="rounded-lg overflow-hidden relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" 
                    alt="Events" 
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-background p-3 rounded-lg shadow-lg z-20 max-w-[200px]">
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin size={14} className="text-findme-accent" />
                    <span className="text-sm">Trending Events Near You</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Over 250+ events happening this month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Featured Events</h2>
            <Link to="/events" className="flex items-center gap-1 text-findme-accent hover:underline">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Explore by Category</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categoryIcons.map((category) => (
              <Link to={`/events?category=${category.name}`} key={category.name}>
                <div className="bg-background hover:shadow-md border rounded-lg p-4 text-center transition-all hover:-translate-y-1">
                  <span className="text-4xl mb-2 block">{category.icon}</span>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">How FindMe Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover Events</h3>
              <p className="text-muted-foreground">Browse through local events happening near you based on your interests.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join or Create</h3>
              <p className="text-muted-foreground">Register for events that interest you or create your own unique event.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-muted-foreground">Meet new people, build your network, and create memorable experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <Logo size="lg" />
            <h2 className="text-3xl md:text-4xl font-bold my-6">Ready to discover your next event?</h2>
            <p className="text-lg mb-8">
              Join thousands of people finding and creating amazing events every day.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/events">Find Events</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
