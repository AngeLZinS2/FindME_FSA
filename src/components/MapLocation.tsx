
import React, { useEffect, useState } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapLocationProps {
  address: string;
  className?: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

const MapLocation: React.FC<MapLocationProps> = ({ address, className = "" }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const wazeUrl = `https://waze.com/ul?q=${encodedAddress}`;

  useEffect(() => {
    const geocodeAddress = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Geocoding address:", address);
        
        // Estratégia 1: Busca com endereço completo
        let response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&countrycodes=BR`
        );
        
        let data = await response.json();
        console.log("Geocoding response (full address):", data);
        
        // Estratégia 2: Se não encontrar, tenta buscar só a cidade
        if (!data || data.length === 0) {
          console.log("Trying with city name only...");
          const cityMatch = address.match(/Feira de Santana|Salvador|São Paulo|Rio de Janeiro|Brasília/i);
          if (cityMatch) {
            const cityName = cityMatch[0];
            const cityQuery = encodeURIComponent(`${cityName}, BA, Brasil`);
            response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${cityQuery}&limit=1&countrycodes=BR`
            );
            data = await response.json();
            console.log("Geocoding response (city only):", data);
          }
        }
        
        // Estratégia 3: Se ainda não encontrar, usa coordenadas padrão para Feira de Santana
        if (!data || data.length === 0) {
          console.log("Using default coordinates for Feira de Santana");
          setCoordinates({
            lat: -12.2577,
            lon: -38.9668
          });
        } else {
          const location = data[0];
          setCoordinates({
            lat: parseFloat(location.lat),
            lon: parseFloat(location.lon)
          });
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        // Em caso de erro, usa coordenadas padrão
        console.log("Using fallback coordinates due to error");
        setCoordinates({
          lat: -12.2577,
          lon: -38.9668
        });
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      geocodeAddress();
    }
  }, [address, encodedAddress]);

  // Generate the map URL with the actual coordinates
  const getMapUrl = () => {
    if (!coordinates) return null;
    
    const { lat, lon } = coordinates;
    const zoom = 15;
    const bbox = [
      lon - 0.01, // west
      lat - 0.01, // south  
      lon + 0.01, // east
      lat + 0.01  // north
    ].join(',');
    
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  };

  const mapUrl = getMapUrl();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-5 w-5" />
        <span>{address}</span>
      </div>
      
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm">Carregando mapa...</span>
          </div>
        ) : mapUrl ? (
          <iframe
            title="Event Location"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            src={mapUrl}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Localização não disponível</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-4 w-4 mr-2" />
            Google Maps
          </a>
        </Button>
        <Button asChild variant="outline" size="sm" className="flex-1">
          <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
            <Navigation className="h-4 w-4 mr-2" />
            Waze
          </a>
        </Button>
      </div>
    </div>
  );
};

export default MapLocation;
