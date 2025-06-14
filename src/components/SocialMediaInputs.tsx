
import React from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";

export interface SocialMediaLink {
  platform: string;
  url: string;
  id: string;
}

interface SocialMediaInputsProps {
  value: SocialMediaLink[];
  onChange: (value: SocialMediaLink[]) => void;
  label: string;
}

const PLATFORMS = [
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "youtube", label: "YouTube", icon: Youtube },
];

const SocialMediaInputs = ({ value, onChange, label }: SocialMediaInputsProps) => {
  const addSocialMedia = () => {
    const unusedPlatform = PLATFORMS.find(
      platform => !value.some(item => item.platform === platform.value)
    );
    
    if (unusedPlatform) {
      onChange([
        ...value,
        {
          platform: unusedPlatform.value,
          url: "",
          id: `social-${Date.now()}`,
        },
      ]);
    }
  };

  const removeSocialMedia = (id: string) => {
    onChange(value.filter(item => item.id !== id));
  };

  const updateSocialMedia = (id: string, field: keyof SocialMediaLink, newValue: string) => {
    onChange(
      value.map(item => (item.id === id ? { ...item, [field]: newValue } : item))
    );
  };

  const getPlatformIcon = (platform: string) => {
    const found = PLATFORMS.find(p => p.value === platform);
    if (!found) return Instagram;
    return found.icon;
  };

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="space-y-3">
          {value.map((item) => {
            const Icon = getPlatformIcon(item.platform);
            const platformLabel = PLATFORMS.find(p => p.value === item.platform)?.label || item.platform;
            
            return (
              <div key={item.id} className="flex items-center space-x-2">
                <div className="flex-none">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  id={`social-media-${item.id}`}
                  name={`social-media-${item.id}`}
                  type="url"
                  placeholder={`URL ${platformLabel}`}
                  value={item.url}
                  onChange={(e) => updateSocialMedia(item.id, "url", e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeSocialMedia(item.id)}
                  aria-label={`Remover ${platformLabel}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          
          {value.length < PLATFORMS.length && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addSocialMedia}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Rede Social
            </Button>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default SocialMediaInputs;
