
import React, { useState } from "react";
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

// Dados mockados para eventos
const initialEvents = [
  {
    id: 1,
    titulo: "Festival de Música Eletrônica",
    organizador: "DJ Productions",
    data: new Date(2025, 5, 15),
    local: "Parque da Cidade",
    capacidade: 500,
    status: "pendente",
    descricao: "O maior festival de música eletrônica da cidade, com DJs nacionais e internacionais.",
  },
  {
    id: 2,
    titulo: "Workshop de Fotografia",
    organizador: "Clube de Fotografia",
    data: new Date(2025, 4, 20),
    local: "Centro Cultural",
    capacidade: 30,
    status: "aprovado",
    descricao: "Aprenda técnicas avançadas de fotografia com especialistas renomados.",
  },
  {
    id: 3,
    titulo: "Feira Gastronômica",
    organizador: "Associação de Chefs",
    data: new Date(2025, 4, 28),
    local: "Praça Central",
    capacidade: 1000,
    status: "pendente",
    descricao: "Uma celebração de sabores com os melhores restaurantes e food trucks da região.",
  },
  {
    id: 4,
    titulo: "Campeonato de eSports",
    organizador: "Liga Gamer",
    data: new Date(2025, 5, 5),
    local: "Arena Digital",
    capacidade: 200,
    status: "rejeitado",
    descricao: "Competição de jogos eletrônicos com premiação para os vencedores.",
    motivoRejeicao: "Faltam informações sobre medidas de segurança",
  },
];

const AdminEventos = () => {
  const [eventos, setEventos] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<typeof initialEvents[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  const [motivoRejeicao, setMotivoRejeicao] = useState("");
  
  const { toast } = useToast();

  const openEventDetails = (event: typeof initialEvents[0]) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
    setMotivoRejeicao("");
  };

  const approveEvent = (id: number) => {
    setEventos(
      eventos.map((event) =>
        event.id === id ? { ...event, status: "aprovado" } : event
      )
    );
    
    setIsDialogOpen(false);
    
    toast({
      title: "Evento aprovado",
      description: "O evento foi aprovado e já está disponível para o público",
    });
  };

  const rejectEvent = (id: number) => {
    if (!motivoRejeicao) {
      toast({
        variant: "destructive",
        title: "Motivo necessário",
        description: "Por favor, informe o motivo da rejeição",
      });
      return;
    }
    
    setEventos(
      eventos.map((event) =>
        event.id === id ? { ...event, status: "rejeitado", motivoRejeicao } : event
      )
    );
    
    setIsDialogOpen(false);
    
    toast({
      title: "Evento rejeitado",
      description: "O evento foi rejeitado. O organizador será notificado",
    });
  };

  const filteredEvents = 
    activeTab === "todos" 
      ? eventos
      : eventos.filter((event) => event.status === activeTab);

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
            <TabsTrigger value="pendente">
              Pendentes ({eventos.filter((e) => e.status === "pendente").length})
            </TabsTrigger>
            <TabsTrigger value="aprovado">
              Aprovados ({eventos.filter((e) => e.status === "aprovado").length})
            </TabsTrigger>
            <TabsTrigger value="rejeitado">
              Rejeitados ({eventos.filter((e) => e.status === "rejeitado").length})
            </TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.titulo}</CardTitle>
                    <StatusBadge status={event.status} />
                  </div>
                  <CardDescription>{event.organizador}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      {format(event.data, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </div>
                    <div>
                      <span className="font-medium">Local:</span> {event.local}
                    </div>
                    <div>
                      <span className="font-medium">Capacidade:</span> {event.capacidade} pessoas
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
              <DialogTitle>{selectedEvent.titulo}</DialogTitle>
              <DialogDescription>
                Organizado por {selectedEvent.organizador}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium">Data e Horário</h3>
                  <p>{format(selectedEvent.data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                </div>
                <div>
                  <h3 className="font-medium">Local</h3>
                  <p>{selectedEvent.local}</p>
                </div>
                <div>
                  <h3 className="font-medium">Capacidade</h3>
                  <p>{selectedEvent.capacidade} pessoas</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <StatusBadge status={selectedEvent.status} />
                </div>
              </div>

              <div>
                <h3 className="font-medium">Descrição</h3>
                <p className="text-muted-foreground">{selectedEvent.descricao}</p>
              </div>
              
              {selectedEvent.status === "rejeitado" && selectedEvent.motivoRejeicao && (
                <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
                  <h3 className="font-medium text-destructive">Motivo da rejeição</h3>
                  <p>{selectedEvent.motivoRejeicao}</p>
                </div>
              )}

              {selectedEvent.status === "pendente" && (
                <>
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="font-medium mb-2">Motivo da rejeição (opcional)</h3>
                    <textarea
                      className="w-full h-20 p-2 rounded-md border border-input resize-none bg-background"
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
    case "aprovado":
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Aprovado
        </Badge>
      );
    case "rejeitado":
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Rejeitado
        </Badge>
      );
    case "pendente":
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
