import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import EventCard, { EventProps } from "@/components/EventCard";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import EventFilters from "@/components/EventFilters";
import { useEventsList } from "@/hooks/useEventsList";

const ITEMS_PER_PAGE = 6;

const EventsPage = () => {
  console.log('🎪 EventsPage renderizando...');
  
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "Todos";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [capacityRange, setCapacityRange] = useState([0, 2000]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [sortOrder, setSortOrder] = useState("date-asc");
  
  const { events: eventsList, loading } = useEventsList();
  
  console.log('🎭 Dados recebidos do hook:');
  console.log('- Eventos:', eventsList);
  console.log('- Quantidade:', eventsList?.length || 0);
  console.log('- Loading:', loading);
  console.log('- Tipo dos eventos:', typeof eventsList);
  console.log('- É array?', Array.isArray(eventsList));
  
  useEffect(() => {
    console.log('🔄 useEffect da página - eventos atualizados:', eventsList);
  }, [eventsList]);

  useEffect(() => {
    console.log('🔄 useEffect da página - loading atualizado:', loading);
  }, [loading]);

  const filteredEvents = eventsList.filter((event) => {
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Todos" || event.category === selectedCategory;
    
    const matchesCapacity = 
      event.capacity >= capacityRange[0] && event.capacity <= capacityRange[1];
    
    const matchesAvailability = 
      !showOnlyAvailable || event.attendees < event.capacity;
    
    return matchesSearch && matchesCategory && matchesCapacity && matchesAvailability;
  });

  console.log('🔍 Eventos após filtros:', filteredEvents);

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    switch(sortOrder) {
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "capacity-asc":
        return a.capacity - b.capacity;
      case "capacity-desc":
        return b.capacity - a.capacity;
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = sortedEvents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  console.log('📄 Eventos paginados para exibir:', paginatedEvents);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    const newParams = new URLSearchParams(searchParams);
    if (value !== "Todos") {
      newParams.set("category", value);
    } else {
      newParams.delete("category");
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page.toString());
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    setSortOrder(value);
  };

  const resetFilters = () => {
    setCapacityRange([0, 2000]);
    setShowOnlyAvailable(false);
    setSearchTerm("");
    setSelectedCategory("Todos");
    setSearchParams({ page: "1" });
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Descubra Eventos</h1>
        
        {/* Debug info for development */}
        <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
          <p><strong>Debug Info:</strong></p>
          <p>• Total eventos: {eventsList?.length || 0}</p>
          <p>• Loading: {loading ? 'Sim' : 'Não'}</p>
          <p>• Eventos após filtros: {filteredEvents?.length || 0}</p>
          <p>• Eventos paginados: {paginatedEvents?.length || 0}</p>
          <p>• Tipo eventsList: {typeof eventsList}</p>
          <p>• É array: {Array.isArray(eventsList) ? 'Sim' : 'Não'}</p>
        </div>
        
        {/* Show loading state */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando eventos...</p>
          </div>
        )}
        
        {/* Show debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-muted rounded-lg text-sm">
            <p>Debug: {eventsList.length} eventos carregados</p>
            <p>Loading: {loading ? 'Sim' : 'Não'}</p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4 bg-accent/50 p-4 rounded-lg mb-6">
          <div className="relative flex-grow">
            <Input
              placeholder="Buscar eventos..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          </div>
          
          <div className="flex gap-3">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="min-w-[150px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {["Todos", "Tecnologia", "Música", "Arte", "Networking", "Gastronomia", "Esportes"].map((category) => (
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
              <span className="md:inline hidden">Filtros</span>
            </Button>
          </div>
        </div>
        
        {showFilters && (
          <EventFilters 
            capacityRange={capacityRange}
            setCapacityRange={setCapacityRange}
            showOnlyAvailable={showOnlyAvailable}
            setShowOnlyAvailable={setShowOnlyAvailable}
            resetFilters={resetFilters}
            onClose={() => setShowFilters(false)}
          />
        )}
        
        {(selectedCategory !== "Todos" || showOnlyAvailable || 
          capacityRange[0] > 0 || capacityRange[1] < 2000 || searchTerm) && (
          <div className="mt-4 mb-6 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Filtros ativos:</span>
            
            {selectedCategory !== "Todos" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Categoria: {selectedCategory}
                <X 
                  size={14} 
                  className="cursor-pointer" 
                  onClick={() => handleCategoryChange("Todos")}
                />
              </Badge>
            )}
            
            {showOnlyAvailable && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Somente Disponíveis
                <X 
                  size={14} 
                  className="cursor-pointer" 
                  onClick={() => setShowOnlyAvailable(false)}
                />
              </Badge>
            )}
            
            {(capacityRange[0] > 0 || capacityRange[1] < 2000) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Capacidade: {capacityRange[0]}-{capacityRange[1]}
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
        
        {!loading && paginatedEvents.length > 0 ? (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                Mostrando {Math.min(ITEMS_PER_PAGE, paginatedEvents.length)} de {filteredEvents.length} {filteredEvents.length === 1 ? "evento" : "eventos"}
              </p>
              <Select defaultValue={sortOrder} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-asc">Data (Mais próximos)</SelectItem>
                  <SelectItem value="date-desc">Data (Mais distantes)</SelectItem>
                  <SelectItem value="capacity-asc">Capacidade (Menor para Maior)</SelectItem>
                  <SelectItem value="capacity-desc">Capacidade (Maior para Menor)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedEvents.map((event) => {
                console.log('🎫 Renderizando evento:', event.title, event);
                return <EventCard key={event.id} event={event} />;
              })}
            </div>
            
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <PaginationItem>
                          <span className="flex h-9 w-9 items-center justify-center">...</span>
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink 
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    </React.Fragment>
                  ))
                }
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : !loading ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold mb-2">Nenhum evento encontrado</h3>
            <p className="text-muted-foreground mb-6">
              Tente ajustar sua busca ou filtros para encontrar eventos.
            </p>
            <Button onClick={resetFilters}>
              Limpar Todos os Filtros
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default EventsPage;
