
import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapLocationProps {
  address: string;
  className?: string;
}

const MapLocation: React.FC<MapLocationProps> = ({ address, className = "" }) => {
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const wazeUrl = `https://waze.com/ul?q=${encodedAddress}`;

  // We'll use a simple iframe with OpenStreetMap for now
  // In a real app, you might want to use a proper maps API like Google Maps or Mapbox
  const openStreetMapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=-180%2C-90%2C180%2C90&layer=mapnik&marker=${encodeURIComponent(address)}`;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-muted-foreground">
        <MapPin className="h-5 w-5" />
        <span>{address}</span>
      </div>
      
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-border">
        <iframe
          title="Event Location"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={openStreetMapUrl}
        />
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
