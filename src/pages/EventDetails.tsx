
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, ArrowLeft, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MapLocation from "@/components/MapLocation";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import { useEventsList } from "@/hooks/useEventsList";
import { useEventParticipation } from "@/hooks/useEventParticipation";
import { useEventAttendees } from "@/hooks/useEventAttendees";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useEventsList();
  const { user } = useSupabaseAuth();
  const { joinEvent, leaveEvent, checkUserParticipation, loading: participationLoading } = useEventParticipation();
  const { attendeesCount, loading: attendeesLoading } = useEventAttendees(id || '');
  
  const [isParticipating, setIsParticipating] = useState(false);
  const [checkingParticipation, setCheckingParticipation] = useState(true);
  
  const event = events.find(e => e.id === id);

  // Verificar se o usuário já está participando
  useEffect(() => {
    const checkParticipation = async () => {
      if (user && id) {
        setCheckingParticipation(true);
        const participating = await checkUserParticipation(id, user.id);
        setIsParticipating(participating);
        setCheckingParticipation(false);
      } else {
        setCheckingParticipation(false);
      }
    };

    checkParticipation();
  }, [user, id, checkUserParticipation]);

  const handleParticipation = async () => {
    if (!user) {
      // Redirecionar para login se não estiver logado
      return;
    }

    if (!id) return;

    if (isParticipating) {
      const result = await leaveEvent(id, user.id);
      if (result.success) {
        setIsParticipating(false);
      }
    } else {
      const result = await joinEvent(id, user.id);
      if (result.success) {
        setIsParticipating(true);
      }
    }
  };
  
  if (!event) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Evento não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O evento que você está procurando não existe ou foi removido.
          </p>
          <Button asChild>
            <Link to="/eventos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Eventos
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isEventPast = eventDate < new Date();
  const currentAttendees = attendeesLoading ? event.attendees : attendeesCount;
  const spotsRemaining = event.capacity - currentAttendees;
  const isFull = spotsRemaining <= 0;

  const getButtonText = () => {
    if (!user) return "Fazer login para participar";
    if (isEventPast) return "Evento já realizado";
    if (isFull && !isParticipating) return "Entrar na lista de espera";
    if (isParticipating) return "Cancelar participação";
    return "Participar do evento";
  };

  const getButtonVariant = () => {
    if (!user || isEventPast || (isFull && !isParticipating)) return "outline";
    if (isParticipating) return "destructive";
    return "default";
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/eventos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Eventos
            </Link>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Coluna principal - Informações do evento */}
          <div className="lg:col-span-2 space-y-6">
            {/* Imagem e título principal */}
            <Card>
              <div className="relative h-64 overflow-hidden rounded-t-lg">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary">{event.category}</Badge>
                </div>
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h1 className="text-3xl font-bold">{event.title}</h1>
                    <p className="text-muted-foreground mt-2">
                      Evento na categoria {event.category}
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre o evento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Localização com mapa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MapLocation address={event.location} />
              </CardContent>
            </Card>

            {/* Redes sociais */}
            {event.socialMedia && event.socialMedia.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Redes Sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <SocialMediaLinks links={event.socialMedia} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Informações de inscrição */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Informações do Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(eventDate, "EEEE", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {currentAttendees}/{event.capacity} participantes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isFull ? "Evento lotado" : `${spotsRemaining} vagas restantes`}
                      </p>
                      {isParticipating && (
                        <p className="text-sm text-green-600 font-medium">
                          ✓ Você está participando
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">Gratuito</p>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={!user ? () => window.location.href = '/login' : handleParticipation}
                    disabled={participationLoading || checkingParticipation || (isEventPast && !isParticipating)}
                    variant={getButtonVariant()}
                  >
                    {participationLoading || checkingParticipation ? "Carregando..." : getButtonText()}
                  </Button>

                  {user && !isEventPast && !checkingParticipation && (
                    <p className="text-xs text-muted-foreground text-center">
                      {isParticipating 
                        ? "Clique para cancelar sua participação" 
                        : isFull 
                          ? "Entre na lista de espera caso alguém desista"
                          : "Clique para confirmar sua participação"
                      }
                    </p>
                  )}

                  {!user && (
                    <p className="text-xs text-muted-foreground text-center">
                      Você precisa estar logado para participar do evento
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
