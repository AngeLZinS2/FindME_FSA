
import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useEventsList } from "@/hooks/useEventsList";
import { calculateDistance, geocodeAddress } from "@/lib/geolocationUtils";
import EventCard, { EventProps } from "./EventCard";

interface EventWithDistance extends EventProps {
  distance: number;
}

const NearbyEvents = () => {
  const { latitude, longitude, error, loading, requestLocation } = useGeolocation();
  const { events } = useEventsList();
  const [nearbyEvents, setNearbyEvents] = useState<EventWithDistance[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      calculateNearbyEvents();
    }
  }, [latitude, longitude, events]);

  const calculateNearbyEvents = async () => {
    if (!latitude || !longitude) return;
    
    setIsCalculating(true);
    console.log("Calculando eventos próximos para:", latitude, longitude);
    
    const eventsWithDistance: EventWithDistance[] = [];
    
    for (const event of events) {
      try {
        const coordinates = await geocodeAddress(event.location);
        
        if (coordinates) {
          const distance = calculateDistance(
            latitude,
            longitude,
            coordinates.lat,
            coordinates.lon
          );
          
          console.log(`Evento: ${event.title}, Distância: ${distance.toFixed(2)}km`);
          
          // Incluir eventos dentro de 50km
          if (distance <= 50) {
            eventsWithDistance.push({
              ...event,
              distance: distance
            });
          }
        }
      } catch (error) {
        console.error(`Erro ao calcular distância para o evento ${event.title}:`, error);
      }
    }
    
    // Ordenar por distância (mais próximos primeiro)
    eventsWithDistance.sort((a, b) => a.distance - b.distance);
    
    console.log("Eventos próximos encontrados:", eventsWithDistance.length);
    setNearbyEvents(eventsWithDistance);
    setIsCalculating(false);
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <CardTitle>Eventos em Alta Perto de Você</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Obtendo sua localização...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <CardTitle>Eventos em Alta Perto de Você</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={requestLocation} variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Eventos Próximos (50km)</CardTitle>
            </div>
            <Button onClick={calculateNearbyEvents} variant="outline" size="sm" disabled={isCalculating}>
              {isCalculating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Atualizar
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            {nearbyEvents.length > 0 
              ? `${nearbyEvents.length} eventos encontrados perto de você`
              : "Nenhum evento encontrado em um raio de 50km"
            }
          </CardDescription>
        </CardHeader>
        
        {isCalculating && (
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Calculando distâncias...</span>
            </div>
          </CardContent>
        )}
      </Card>

      {nearbyEvents.length > 0 && !isCalculating && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nearbyEvents.slice(0, 6).map((event) => (
            <div key={event.id} className="relative">
              <EventCard event={event} />
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                {event.distance.toFixed(1)}km
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyEvents;
