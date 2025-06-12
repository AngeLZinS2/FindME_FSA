
import React from "react";
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

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { events } = useEventsList();
  
  const event = events.find(e => e.id === id);
  
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
  const spotsRemaining = event.capacity - event.attendees;
  const isFull = spotsRemaining <= 0;

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
                        {event.attendees}/{event.capacity} participantes
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isFull ? "Evento lotado" : `${spotsRemaining} vagas restantes`}
                      </p>
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
                    disabled={isFull || isEventPast}
                    variant={isFull || isEventPast ? "outline" : "default"}
                  >
                    {isEventPast 
                      ? "Evento já realizado" 
                      : isFull 
                        ? "Entrar na lista de espera" 
                        : "Participar do evento"
                    }
                  </Button>

                  {!isFull && !isEventPast && (
                    <p className="text-xs text-muted-foreground text-center">
                      Você será redirecionado para confirmar sua participação
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
