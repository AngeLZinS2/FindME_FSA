import React, { useState, useEffect } from "react";
import { CalendarCheck, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useSupabaseEvents } from "@/hooks/useSupabaseEvents";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
  price: number;
  image?: string;
  status: string;
  creator_name: string;
  social_media?: any;
}

const UserEvents = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { getUserEvents, deleteEvent } = useSupabaseEvents();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user) {
        console.log('👤 [UserEvents] Usuário não logado');
        setLoading(false);
        return;
      }
      
      console.log('🔍 [UserEvents] Buscando eventos do usuário:', user.id);
      setLoading(true);
      
      try {
        const { data, error } = await getUserEvents(user.id);
        
        console.log('📊 [UserEvents] Resultado da busca:', { 
          count: data?.length || 0, 
          hasError: !!error,
          data: data 
        });
        
        if (error) {
          console.error('❌ [UserEvents] Erro ao buscar eventos:', error);
          toast({
            variant: "destructive",
            title: "Erro ao carregar eventos",
            description: "Não foi possível carregar seus eventos.",
          });
          setEvents([]);
        } else if (data) {
          console.log('✅ [UserEvents] Eventos carregados:', data.length);
          setEvents(data as Event[]);
        } else {
          console.log('📭 [UserEvents] Nenhum evento encontrado');
          setEvents([]);
        }
      } catch (exception) {
        console.error('💥 [UserEvents] Exceção:', exception);
        toast({
          variant: "destructive",
          title: "Erro inesperado",
          description: "Ocorreu um erro ao carregar os eventos.",
        });
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [user, getUserEvents, toast]);

  const handleDeleteEvent = async (id: string) => {
    console.log('🗑️ [UserEvents] Deletando evento:', id);
    
    try {
      const { error } = await deleteEvent(id);
      
      if (error) {
        console.error('❌ [UserEvents] Erro ao deletar:', error);
        toast({
          variant: "destructive",
          title: "Erro ao excluir",
          description: "Não foi possível excluir o evento.",
        });
      } else {
        console.log('✅ [UserEvents] Evento deletado com sucesso');
        setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
        toast({
          title: "Evento excluído",
          description: "O evento foi removido com sucesso.",
        });
      }
    } catch (exception) {
      console.error('💥 [UserEvents] Exceção ao deletar:', exception);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao excluir o evento.",
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default">Aprovado</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejeitado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  console.log('🎭 [UserEvents] Estado atual:', { 
    userLoggedIn: !!user,
    eventCount: events.length, 
    loading 
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">Acesso negado</h3>
        <p className="text-muted-foreground mb-4">
          Você precisa estar logado para ver seus eventos.
        </p>
        <Button onClick={() => navigate("/login")}>
          Fazer Login
        </Button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">Você ainda não tem eventos</h3>
        <p className="text-muted-foreground mb-4">
          Comece a criar seus eventos agora mesmo e divulgue para seu público.
        </p>
        <Button onClick={() => navigate("/perfil?tab=create")}>
          Criar Meu Primeiro Evento
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardHeader className="bg-accent/20 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <CardDescription className="flex items-center mt-2">
                  <span className="mr-4">
                    Data: {formatDate(event.date)} às {event.time}
                  </span>
                  <Badge>{event.category}</Badge>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" /> Ver
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" /> Editar
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1 text-destructive" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir evento</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o evento "{event.title}"? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteEvent(event.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Detalhes:</h4>
                <p className="text-muted-foreground text-sm">
                  {event.description.length > 150
                    ? `${event.description.substring(0, 150)}...`
                    : event.description}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Local:</span>
                  <span className="text-muted-foreground">{event.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Capacidade:</span>
                  <span className="text-muted-foreground">{event.capacity} pessoas</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Preço:</span>
                  <span className="text-muted-foreground">
                    {event.price ? `R$ ${event.price}` : "Gratuito"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Status:</span>
                  {getStatusBadge(event.status)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserEvents;
