
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Descubra Eventos Incríveis
          </h1>
          <p className="text-xl text-gray-600">
            Encontre experiências únicas perto de você
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Buscar Eventos</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  type="search"
                  placeholder="Digite o nome do evento..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <EventFilters
                selectedCategory={selectedCategory}
                selectedLocation={selectedLocation}
                onCategoryChange={handleCategoryChange}
                onLocationChange={handleLocationChange}
              />
            </div>
          </div>

          {/* Grid de Eventos */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {filteredEvents.length} eventos encontrados
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <>
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                  <EventCardSkeleton />
                </>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                    <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">
                      Nenhum evento encontrado
                    </h3>
                    <p className="text-gray-600">
                      Tente ajustar os filtros ou o termo de busca para encontrar eventos que correspondam aos seus interesses.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
