
import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import EventFilters from "@/components/EventFilters";
import { useMockEventsList } from "@/hooks/useMockEventsList";

const Events = () => {
  const { events, loading } = useMockEventsList();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedLocation, setSelectedLocation] = useState("Todas");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  const filteredEvents = events.filter((event) => {
    const searchRegex = new RegExp(searchTerm, "i");
    const categoryMatch =
      selectedCategory === "Todas" || event.category === selectedCategory;
    const locationMatch =
      selectedLocation === "Todas" || event.location.includes(selectedLocation);

    return (
      searchRegex.test(event.title) && categoryMatch && locationMatch
    );
  });

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/4">
          <div className="mb-4">
            <Input
              type="search"
              placeholder="Buscar evento..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <EventFilters
            selectedCategory={selectedCategory}
            selectedLocation={selectedLocation}
            onCategoryChange={handleCategoryChange}
            onLocationChange={handleLocationChange}
          />
        </div>
        <div className="md:w-3/4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <>
                <EventCardSkeleton />
                <EventCardSkeleton />
                <EventCardSkeleton />
              </>
            ) : filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">
                  Nenhum evento encontrado
                </h3>
                <p className="text-muted-foreground">
                  Tente ajustar os filtros ou o termo de busca.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
