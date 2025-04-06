
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

// Esquema de validação para o formulário de evento
const eventSchema = z.object({
  title: z.string().min(5, "O título deve ter pelo menos 5 caracteres"),
  description: z.string().min(20, "A descrição deve ter pelo menos 20 caracteres"),
  date: z.string().min(1, "Escolha uma data"),
  time: z.string().min(1, "Escolha um horário"),
  location: z.string().min(5, "O local deve ter pelo menos 5 caracteres"),
  category: z.string().min(1, "Escolha uma categoria"),
  capacity: z.string().min(1, "Informe a capacidade do evento"),
  price: z.string().optional(),
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
    },
  });

  const onSubmit = (data: EventFormValues) => {
    // Simular uma criação de evento bem-sucedida
    console.log("Dados do novo evento:", data);
    
    // Adicionar evento aos eventos do usuário no localStorage
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      
      // Obter eventos existentes ou inicializar array vazio
      const userEvents = JSON.parse(localStorage.getItem("userEvents") || "[]");
      
      // Adicionar o novo evento com ID único
      const newEvent = {
        id: Date.now(),
        ...data,
        creatorId: user.email,
        creatorName: user.name,
        status: "active",
        attendees: [],
      };
      
      userEvents.push(newEvent);
      localStorage.setItem("userEvents", JSON.stringify(userEvents));
      
      toast({
        title: "Evento criado com sucesso!",
        description: `O evento "${data.title}" foi cadastrado.`,
      });
      
      // Limpar formulário
      form.reset();
      
      if (onSuccess) onSuccess(data);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="educacional">Educacional</SelectItem>
                  <SelectItem value="corporativo">Corporativo</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="esportivo">Esportivo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
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
          
        <Button type="submit" className="w-full md:w-auto">
          <CalendarPlus className="mr-2 h-4 w-4" /> Criar Evento
        </Button>
      </form>
    </Form>
  );
};

export default EventCreationForm;
