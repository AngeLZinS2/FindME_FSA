
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EventFiltersProps {
  selectedCategory: string;
  selectedLocation: string;
  onCategoryChange: (category: string) => void;
  onLocationChange: (location: string) => void;
}

const EventFilters: React.FC<EventFiltersProps> = ({
  selectedCategory,
  selectedLocation,
  onCategoryChange,
  onLocationChange,
}) => {
  const categories = ["Todas", "Tecnologia", "Música", "Arte", "Esportes", "Educação"];
  const locations = ["Todas", "São Paulo", "Rio de Janeiro", "Belo Horizonte", "Salvador", "Brasília"];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium mb-2">Categoria</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                checked={selectedCategory === category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="text-primary"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2">Localização</h3>
        <div className="space-y-2">
          {locations.map((location) => (
            <label key={location} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="location"
                value={location}
                checked={selectedLocation === location}
                onChange={(e) => onLocationChange(e.target.value)}
                className="text-primary"
              />
              <span className="text-sm">{location}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFilters;
