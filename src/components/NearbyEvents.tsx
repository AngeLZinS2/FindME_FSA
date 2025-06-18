import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useMockEventsList } from "@/hooks/useMockEventsList";
import { calculateDistance, geocodeAddress } from "@/lib/geolocationUtils";
import EventCard, { EventProps } from "./EventCard";

interface EventWithDistance extends EventProps {
  distance: number;
}

const NearbyEvents = () => {
  const { latitude, longitude, error, loading, requestLocation } = useGeolocation();
  const { events } = useMockEventsList();
  const [nearbyEvents, setNearbyEvents] = useState<EventWithDistance[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [searchRadius, setSearchRadius] = useState<number[]>([5]); // Padrão: 5km

  useEffect(() => {
    if (latitude && longitude) {
      calculateNearbyEvents();
    }
  }, [latitude, longitude, events, searchRadius]);

  const calculateNearbyEvents = async () => {
    if (!latitude || !longitude) return;
    
    setIsCalculating(true);
    const radiusInKm = searchRadius[0];
    console.log(`Calculando eventos próximos para: ${latitude}, ${longitude} - Raio: ${radiusInKm}km`);
    
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
          
          // Incluir eventos dentro do raio definido pelo usuário
          if (distance <= radiusInKm) {
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

  const formatDistance = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)}m`;
    }
    return `${km}km`;
  };

  const formatRadius = (km: number) => {
    if (km < 1) {
      return `${Math.round(km * 1000)} metros`;
    }
    return `${km} km`;
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
              <CardTitle>Eventos Próximos</CardTitle>
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
              ? `${nearbyEvents.length} eventos encontrados em um raio de ${formatRadius(searchRadius[0])}`
              : `Nenhum evento encontrado em um raio de ${formatRadius(searchRadius[0])}`
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Raio de busca: {formatRadius(searchRadius[0])}
              </label>
              <Slider
                value={searchRadius}
                onValueChange={setSearchRadius}
                min={0.05} // 50 metros
                max={150} // 150km
                step={0.05}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>50m</span>
                <span>150km</span>
              </div>
            </div>
          </div>
        </CardContent>
        
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
                {formatDistance(event.distance)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NearbyEvents;
