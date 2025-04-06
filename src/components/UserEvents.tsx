
import React from "react";
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

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: string;
  price?: string;
  creatorId: string;
  creatorName: string;
  status: string;
  attendees: string[];
}

const UserEvents = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [events, setEvents] = React.useState<Event[]>([]);

  // Buscar eventos do usuário ao carregar o componente
  React.useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    
    if (currentUser) {
      const user = JSON.parse(currentUser);
      const allEvents = JSON.parse(localStorage.getItem("userEvents") || "[]");
      const userEvents = allEvents.filter((event: Event) => event.creatorId === user.email);
      setEvents(userEvents);
    }
  }, []);

  const deleteEvent = (id: number) => {
    // Remover evento da lista no localStorage
    const allEvents = JSON.parse(localStorage.getItem("userEvents") || "[]");
    const updatedEvents = allEvents.filter((event: Event) => event.id !== id);
    
    localStorage.setItem("userEvents", JSON.stringify(updatedEvents));
    
    // Atualizar estado
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
    
    toast({
      title: "Evento excluído",
      description: "O evento foi removido com sucesso.",
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Caso não tenha eventos
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
                        onClick={() => deleteEvent(event.id)}
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
                  <Badge variant={event.status === "active" ? "default" : "secondary"}>
                    {event.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
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
