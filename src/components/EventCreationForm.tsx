
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import SocialMediaInputs, { SocialMediaLink } from "@/components/SocialMediaInputs";
import { getCategoryPlaceholderImage } from "@/lib/imageUtils";

const socialMediaSchema = z.object({
  id: z.string(),
  platform: z.string(),
  url: z.string().url("URL inválida")
});

const eventSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres"),
  date: z.string().min(1, "Escolha uma data"),
  time: z.string().min(1, "Escolha um horário"),
  location: z.string().min(5, "O local deve ter pelo menos 5 caracteres"),
  category: z.string().min(1, "Escolha uma categoria"),
  capacity: z.string().min(1, "Informe a capacidade do evento"),
  price: z.string().optional(),
  image: z.string().nullable().optional(),
  socialMedia: z.array(socialMediaSchema).optional(),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventCreationFormProps {
  onSuccess?: (data: EventFormValues) => void;
}

const EventCreationForm = ({ onSuccess }: EventCreationFormProps) => {
  const { toast } = useToast();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
      capacity: "",
      price: "",
      image: null,
      socialMedia: [],
    },
  });

  const onSubmit = (data: EventFormValues) => {
    console.log("Dados do novo evento:", data);
    
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      
      const userEvents = JSON.parse(localStorage.getItem("userEvents") || "[]");
      const adminEvents = JSON.parse(localStorage.getItem("adminEvents") || "[]");
      
      const eventDate = new Date(`${data.date}T${data.time}`);
      
      // Get image from upload or use placeholder based on category
      const eventImage = data.image || getCategoryPlaceholderImage(data.category);
      
      // Ensure social media data is properly typed
      const socialMedia: SocialMediaLink[] = data.socialMedia || [];
      
      const newEvent = {
        id: Date.now(),
        titulo: data.title,
        descricao: data.description,
        data: eventDate,
        local: data.location,
        categoria: data.category,
        capacidade: parseInt(data.capacity),
        preco: data.price ? parseFloat(data.price) : 0,
        organizador: user.name,
        organizadorId: user.email,
        status: "pendente",
        attendees: [],
        image: eventImage,
        socialMedia,
      };
      
      userEvents.push({
        ...newEvent,
        date: data.date,
        time: data.time,
      });
      
      adminEvents.push(newEvent);
      
      localStorage.setItem("userEvents", JSON.stringify(userEvents));
      localStorage.setItem("adminEvents", JSON.stringify(adminEvents));
      
      toast({
        title: "Evento enviado para aprovação!",
        description: `O evento "${data.title}" foi cadastrado e está aguardando aprovação do administrador.`,
      });
      
      form.reset();
      
      if (onSuccess) onSuccess(data);
    }
  };

  const categoryValue = form.watch("category");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título do Evento</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título do evento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva os detalhes do seu evento" 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <ImageUpload
                onChange={field.onChange}
                value={field.value}
                label="Imagem de Capa"
              />
            )}
          />
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Local</FormLabel>
                <FormControl>
                  <Input placeholder="Endereço do evento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Tecnologia">Tecnologia</SelectItem>
                    <SelectItem value="Música">Música</SelectItem>
                    <SelectItem value="Arte">Arte</SelectItem>
                    <SelectItem value="Networking">Networking</SelectItem>
                    <SelectItem value="Gastronomia">Gastronomia</SelectItem>
                    <SelectItem value="Esportes">Esportes</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="socialMedia"
            render={({ field }) => (
              <SocialMediaInputs
                value={field.value || []}
                onChange={field.onChange}
                label="Redes Sociais"
              />
            )}
          />
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidade</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" placeholder="Número de participantes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      placeholder="Deixe em branco se for gratuito" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
          
        <Button type="submit" className="w-full md:w-auto">
          <CalendarPlus className="mr-2 h-4 w-4" /> Criar Evento
        </Button>
      </form>
    </Form>
  );
};

export default EventCreationForm;
