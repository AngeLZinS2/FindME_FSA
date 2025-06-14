
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
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useSupabaseEvents } from "@/hooks/useSupabaseEvents";

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
  const { user } = useSupabaseAuth();
  const { createEvent } = useSupabaseEvents();

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

  const onSubmit = async (data: EventFormValues) => {
    console.log('Form submitted with data:', data);
    console.log('Current user:', user);

    if (!user) {
      console.error('No user found');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para criar um evento.",
      });
      return;
    }

    try {
      const eventImage = data.image || getCategoryPlaceholderImage(data.category);
      
      const socialMedia: SocialMediaLink[] = (data.socialMedia || []).map(item => ({
        id: item.id,
        platform: item.platform,
        url: item.url
      }));
      
      const eventData = {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location,
        category: data.category,
        capacity: parseInt(data.capacity),
        price: data.price ? parseFloat(data.price) : 0,
        image: eventImage,
        socialMedia,
      };

      console.log('Creating event with data:', eventData);

      const { error } = await createEvent(eventData, user.id, user.name);
      
      if (error) {
        console.error('Error creating event:', error);
        toast({
          variant: "destructive",
          title: "Erro ao criar evento",
          description: error.message || "Não foi possível criar o evento.",
        });
      } else {
        console.log('Event created successfully');
        toast({
          title: "Evento criado com sucesso!",
          description: `O evento "${data.title}" foi criado e está aguardando aprovação.`,
        });
        
        form.reset();
        
        if (onSuccess) onSuccess(data);
      }
    } catch (error) {
      console.error('Exception creating event:', error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao criar o evento. Tente novamente.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="event-title">Título do Evento</FormLabel>
                <FormControl>
                  <Input 
                    id="event-title"
                    placeholder="Digite o título do evento" 
                    {...field} 
                  />
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
                <FormLabel htmlFor="event-description">Descrição</FormLabel>
                <FormControl>
                  <Textarea 
                    id="event-description"
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
                  <FormLabel htmlFor="event-date">Data</FormLabel>
                  <FormControl>
                    <Input 
                      id="event-date"
                      type="date" 
                      {...field} 
                    />
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
                  <FormLabel htmlFor="event-time">Horário</FormLabel>
                  <FormControl>
                    <Input 
                      id="event-time"
                      type="time" 
                      {...field} 
                    />
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
                <FormLabel htmlFor="event-location">Local</FormLabel>
                <FormControl>
                  <Input 
                    id="event-location"
                    placeholder="Endereço do evento" 
                    {...field} 
                  />
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
                <FormLabel htmlFor="event-category">Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger id="event-category">
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
            render={({ field }) => {
              const typedValue: SocialMediaLink[] = (field.value || []).map(item => ({
                id: item.id || `social-${Date.now()}-${Math.random()}`,
                platform: item.platform || '',
                url: item.url || ''
              }));
              
              return (
                <SocialMediaInputs
                  value={typedValue}
                  onChange={field.onChange}
                  label="Redes Sociais"
                />
              );
            }}
          />
            
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="event-capacity">Capacidade</FormLabel>
                  <FormControl>
                    <Input 
                      id="event-capacity"
                      type="number" 
                      min="1" 
                      placeholder="Número de participantes" 
                      {...field} 
                    />
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
                  <FormLabel htmlFor="event-price">Preço (opcional)</FormLabel>
                  <FormControl>
                    <Input 
                      id="event-price"
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
