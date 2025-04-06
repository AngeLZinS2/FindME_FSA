
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EventFiltersProps {
  capacityRange: number[];
  setCapacityRange: (range: number[]) => void;
  showOnlyAvailable: boolean;
  setShowOnlyAvailable: (show: boolean) => void;
  resetFilters: () => void;
  onClose: () => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  capacityRange,
  setCapacityRange,
  showOnlyAvailable,
  setShowOnlyAvailable,
  resetFilters,
  onClose,
}) => {
  return (
    <div className="mt-4 p-4 bg-background border rounded-md shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">Filtros</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X size={16} />
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Capacidade do Evento</h3>
          <Slider 
            value={capacityRange} 
            min={0} 
            max={2000} 
            step={50} 
            onValueChange={setCapacityRange} 
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{capacityRange[0]} pessoas</span>
            <span>{capacityRange[1]} pessoas</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-4">Opções</h3>
          <div className="flex items-center space-x-2">
            <Switch 
              id="available-only" 
              checked={showOnlyAvailable} 
              onCheckedChange={setShowOnlyAvailable} 
            />
            <Label htmlFor="available-only">Mostrar apenas eventos disponíveis</Label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <Button 
          variant="outline" 
          className="mr-2"
          onClick={resetFilters}
        >
          Limpar Filtros
        </Button>
        <Button onClick={onClose}>Aplicar</Button>
      </div>
    </div>
  );
};

export default EventFilters;
