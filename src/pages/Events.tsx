
import React, { useState } from "react";
import { Search, Filter, MapPin, Calendar, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import EventFilters from "@/components/EventFilters";
import { useMockEventsList } from "@/hooks/useMockEventsList";

const Events = () => {
  const { events, loading } = useMockEventsList();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedLocation, setSelectedLocation] = useState("Todas");
  const [showFilters, setShowFilters] = useState(false);

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

  const hasActiveFilters = selectedCategory !== "Todas" || selectedLocation !== "Todas";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-white border-b py-12 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Eventos na sua região
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Descubra experiências incríveis acontecendo perto de você
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-gray-50 rounded-2xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="Buscar eventos..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-12 border-0 bg-white text-lg h-12 focus-visible:ring-0"
                  />
                </div>
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 px-6"
                >
                  <SlidersHorizontal className="h-5 w-5 mr-2" />
                  Filtros
                  {hasActiveFilters && (
                    <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {(selectedCategory !== "Todas" ? 1 : 0) + (selectedLocation !== "Todas" ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Filtros */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="bg-white border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategory("Todas");
                        setSelectedLocation("Todas");
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
                <EventFilters
                  selectedCategory={selectedCategory}
                  selectedLocation={selectedLocation}
                  onCategoryChange={handleCategoryChange}
                  onLocationChange={handleLocationChange}
                />
              </CardContent>
            </Card>
          </div>

          {/* Grid de Eventos */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {loading ? "Carregando..." : `${filteredEvents.length} eventos encontrados`}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>Região: {selectedLocation === "Todas" ? "Todas as cidades" : selectedLocation}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Categoria: {selectedCategory}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <EventCardSkeleton key={index} />
                ))
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <div className="col-span-full">
                  <Card className="bg-white border-0 shadow-sm">
                    <CardContent className="text-center py-16">
                      <Search className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Nenhum evento encontrado
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Não encontramos eventos com os filtros selecionados. Tente ajustar sua busca ou explorar outras categorias.
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setSelectedCategory("Todas");
                          setSelectedLocation("Todas");
                        }}
                        variant="outline"
                      >
                        Limpar filtros
                      </Button>
                    </CardContent>
                  </Card>
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
