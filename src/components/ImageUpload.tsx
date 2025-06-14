
import React, { useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  MAX_FILE_SIZE, 
  ACCEPTED_IMAGE_EXTENSIONS, 
  isValidFileSize, 
  isValidFileType 
} from "@/lib/imageUtils";

interface ImageUploadProps {
  onChange: (value: string | null) => void;
  value: string | null;
  label: string;
}

const ImageUpload = ({ onChange, value, label }: ImageUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!isValidFileSize(file)) {
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter no máximo 5MB",
        variant: "destructive",
      });
      return;
    }
    
    if (!isValidFileType(file)) {
      toast({
        title: "Formato não suportado",
        description: "Por favor, envie apenas imagens JPG, PNG ou WEBP",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsUploading(true);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        onChange(reader.result as string);
        setIsUploading(false);
      };
      reader.onerror = () => {
        toast({
          title: "Erro ao processar imagem",
          description: "Ocorreu um erro ao processar a imagem. Tente novamente.",
          variant: "destructive",
        });
        setIsUploading(false);
      };
    } catch (error) {
      toast({
        title: "Erro ao enviar imagem",
        description: "Ocorreu um erro ao enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    onChange(null);
  };

  return (
    <FormItem>
      <FormLabel htmlFor="event-image-input">{label}</FormLabel>
      <FormControl>
        <div className="space-y-2">
          {value ? (
            <div className="relative">
              <img 
                src={value} 
                alt="Preview da imagem do evento" 
                className="w-full h-48 object-contain rounded-md bg-muted/50 border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={handleRemoveImage}
                aria-label="Remover imagem"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-muted/50">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Clique para fazer upload
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou WEBP (max. 5MB)
              </p>
              <Input
                type="file"
                accept={ACCEPTED_IMAGE_EXTENSIONS}
                onChange={handleImageChange}
                disabled={isUploading}
                className="hidden"
                id="event-image-input"
                name="event-image"
              />
              <Button
                type="button"
                variant="outline"
                className="mt-2"
                disabled={isUploading}
                onClick={() => document.getElementById("event-image-input")?.click()}
              >
                {isUploading ? "Enviando..." : "Selecionar imagem"}
              </Button>
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default ImageUpload;
