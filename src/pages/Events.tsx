
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Calendar, Clock, MapPin, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import EventCard, { EventProps } from "@/components/EventCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  }
];

const categories = [
  "All",
  "Technology",
  "Music",
  "Art",
  "Networking",
  "Food",
  "Sports",
];

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [capacityRange, setCapacityRange] = useState([0, 2000]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  
  // Filter events based on search, category, and other filters
  const filteredEvents = eventsList.filter((event) => {
    // Filter by search term
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by category
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    
    // Filter by capacity
    const matchesCapacity = 
      event.capacity >= capacityRange[0] && event.capacity <= capacityRange[1];
    
    // Filter by availability
    const matchesAvailability = 
      !showOnlyAvailable || event.attendees < event.capacity;
    
    return matchesSearch && matchesCategory && matchesCapacity && matchesAvailability;
  });

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value !== "All") {
      setSearchParams({ category: value });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <section className="bg-accent/50 py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Discover Events</h1>
            
            {/* Search and filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search for events..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="min-w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} />
                  <span className="md:inline hidden">Filters</span>
                </Button>
              </div>
            </div>
            
            {/* Extended filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-background border rounded-md shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X size={16} />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Event Capacity</h3>
                    <Slider 
                      defaultValue={capacityRange} 
                      min={0} 
                      max={2000} 
                      step={50} 
                      onValueChange={setCapacityRange} 
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{capacityRange[0]} people</span>
                      <span>{capacityRange[1]} people</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-4">Options</h3>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="available-only" 
                        checked={showOnlyAvailable} 
                        onCheckedChange={setShowOnlyAvailable} 
                      />
                      <Label htmlFor="available-only">Show only available events</Label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6">
                  <Button 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => {
                      setCapacityRange([0, 2000]);
                      setShowOnlyAvailable(false);
                      setSearchTerm("");
                      setSelectedCategory("All");
                      setSearchParams({});
                    }}
                  >
                    Reset Filters
                  </Button>
                  <Button onClick={() => setShowFilters(false)}>Apply</Button>
                </div>
              </div>
            )}
            
            {/* Active filters */}
            {(selectedCategory !== "All" || showOnlyAvailable || 
              capacityRange[0] > 0 || capacityRange[1] < 2000 || searchTerm) && (
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                
                {selectedCategory !== "All" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {selectedCategory}
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => handleCategoryChange("All")}
                    />
                  </Badge>
                )}
                
                {showOnlyAvailable && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Available Only
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => setShowOnlyAvailable(false)}
                    />
                  </Badge>
                )}
                
                {(capacityRange[0] > 0 || capacityRange[1] < 2000) && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Capacity: {capacityRange[0]}-{capacityRange[1]}
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => setCapacityRange([0, 2000])}
                    />
                  </Badge>
                )}
                
                {searchTerm && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    "{searchTerm}"
                    <X 
                      size={14} 
                      className="cursor-pointer" 
                      onClick={() => setSearchTerm("")}
                    />
                  </Badge>
                )}
              </div>
            )}
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-4">
            {filteredEvents.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <p className="text-muted-foreground">
                    Showing {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
                  </p>
                  <Select defaultValue="date-asc">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-asc">Date (Earliest first)</SelectItem>
                      <SelectItem value="date-desc">Date (Latest first)</SelectItem>
                      <SelectItem value="capacity-asc">Capacity (Low to High)</SelectItem>
                      <SelectItem value="capacity-desc">Capacity (High to Low)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters to find events.
                </p>
                <Button 
                  onClick={() => {
                    setCapacityRange([0, 2000]);
                    setShowOnlyAvailable(false);
                    setSearchTerm("");
                    setSelectedCategory("All");
                    setSearchParams({});
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventsPage;
