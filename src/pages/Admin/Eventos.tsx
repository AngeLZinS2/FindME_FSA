
import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle2, XCircle, Eye, Clock, Filter } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

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
  creator_id: string;
  created_at: string;
}

const AdminEventos = () => {
  const [eventos, setEventos] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching events:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar eventos",
          description: "Não foi possível carregar os eventos.",
        });
      } else {
        setEventos(data || []);
      }
    } catch (error) {
      console.error('Exception fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchEvents();
  }, []);

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
    setMotivoRejeicao("");
  };

  const approveEvent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) {
        console.error('Error approving event:', error);
        toast({
          variant: "destructive",
          title: "Erro ao aprovar evento",
          description: "Não foi possível aprovar o evento.",
        });
      } else {
        // Atualizar estado local
        setEventos(eventos.map(event => 
          event.id === id ? { ...event, status: 'approved' } : event
        ));
        
        setIsDialogOpen(false);
        
        toast({
          title: "Evento aprovado",
          description: "O evento foi aprovado e já está disponível para o público",
        });
      }
    } catch (error) {
      console.error('Exception approving event:', error);
    }
  };

  const rejectEvent = async (id: string) => {
    if (!motivoRejeicao) {
      toast({
        variant: "destructive",
        title: "Motivo necessário",
        description: "Por favor, informe o motivo da rejeição",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .update({ 
          status: 'rejected',
          // Note: Adicionar campo rejection_reason na tabela se necessário
        })
        .eq('id', id);

      if (error) {
        console.error('Error rejecting event:', error);
        toast({
          variant: "destructive",
          title: "Erro ao rejeitar evento",
          description: "Não foi possível rejeitar o evento.",
        });
      } else {
        // Atualizar estado local
        setEventos(eventos.map(event => 
          event.id === id ? { ...event, status: 'rejected' } : event
        ));
        
        setIsDialogOpen(false);
        
        toast({
          title: "Evento rejeitado",
          description: "O evento foi rejeitado. O organizador será notificado",
        });
      }
    } catch (error) {
      console.error('Exception rejecting event:', error);
    }
  };

  const filteredEvents = 
    activeTab === "todos" 
      ? eventos
      : eventos.filter((event) => event.status === activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Eventos</h1>
        <p className="text-muted-foreground">
          Analise e aprove/rejeite os eventos criados pelos organizadores
        </p>
      </div>

      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="todos">
              Todos ({eventos.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pendentes ({eventos.filter((e) => e.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Aprovados ({eventos.filter((e) => e.status === "approved").length})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejeitados ({eventos.filter((e) => e.status === "rejected").length})
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" onClick={fetchEvents}>
            <Filter className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <StatusBadge status={event.status} />
                  </div>
                  <CardDescription>{event.creator_name}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                    <div>
                      <span className="font-medium">Local:</span> {event.location}
                    </div>
                    <div>
                      <span className="font-medium">Capacidade:</span> {event.capacity} pessoas
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => openEventDetails(event)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum evento encontrado nesta categoria.
            </div>
          )}
        </TabsContent>
      </Tabs>

      {selectedEvent && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedEvent.title}</DialogTitle>
              <DialogDescription>
                Organizado por {selectedEvent.creator_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Data e Horário</h3>
                  <p>{format(new Date(selectedEvent.date), "dd/MM/yyyy", { locale: ptBR })} às {selectedEvent.time}</p>
                </div>
                <div>
                  <h3 className="font-medium">Local</h3>
                  <p>{selectedEvent.location}</p>
                </div>
                <div>
                  <h3 className="font-medium">Capacidade</h3>
                  <p>{selectedEvent.capacity} pessoas</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <StatusBadge status={selectedEvent.status} />
                </div>
              </div>

              <div>
                <h3 className="font-medium">Descrição</h3>
                <p className="text-muted-foreground">{selectedEvent.description}</p>
              </div>

              {selectedEvent.status === "pending" && (
                <>
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Motivo da rejeição (opcional)</h3>
                    <Textarea
                      className="w-full resize-none bg-background"
                      placeholder="Informe o motivo caso vá rejeitar o evento..."
                      value={motivoRejeicao}
                      onChange={(e) => setMotivoRejeicao(e.target.value)}
                    />
                  </div>

                  <DialogFooter className="gap-2 sm:justify-between sm:space-x-0">
                    <Button
                      variant="destructive"
                      onClick={() => rejectEvent(selectedEvent.id)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeitar Evento
                    </Button>
                    <Button onClick={() => approveEvent(selectedEvent.id)}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Aprovar Evento
                    </Button>
                  </DialogFooter>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Componente de badge para status
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "approved":
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Rejeitado
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="border-amber-500 text-amber-500">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export default AdminEventos;
