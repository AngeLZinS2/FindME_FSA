import React from "react";
import { Calendar, Users, MapPin, Star, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import NearbyEvents from "@/components/NearbyEvents";
import { useMockEventsList } from "@/hooks/useMockEventsList";

const Index = () => {
  const { events, loading } = useMockEventsList();

  return (
    <div className="container mx-auto py-12 space-y-8">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Descubra Eventos Incríveis Perto de Você
            </h1>
            <p className="text-muted-foreground">
              Explore, participe e conecte-se com eventos que inspiram.
            </p>
          </div>
          <Button asChild>
            <Link to="/eventos">
              Ver todos os eventos <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Eventos em Destaque <Sparkles className="inline-block h-5 w-5 ml-1" />
          </h2>
          <Link to="/eventos" className="text-sm font-medium hover:underline">
            Explore mais
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </>
          ) : events.length > 0 ? (
            events.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="col-span-3 text-center py-8">
              <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Nenhum evento em destaque no momento.
              </p>
            </div>
          )}
        </div>
      </section>

      <section>
        <NearbyEvents />
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Comunidades Ativas</CardTitle>
            </div>
            <CardDescription>
              Participe de grupos e comunidades para expandir seu network.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Devs do Brasil</p>
                <p className="text-xs text-muted-foreground">
                  Comunidade de desenvolvedores
                </p>
              </div>
              <Badge variant="secondary">540 membros</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Amantes da Gastronomia</p>
                <p className="text-xs text-muted-foreground">
                  Compartilhe receitas e experiências
                </p>
              </div>
              <Badge variant="secondary">320 membros</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Artistas Visuais BR</p>
                <p className="text-xs text-muted-foreground">
                  Espaço para artistas mostrarem seus trabalhos
                </p>
              </div>
              <Badge variant="secondary">280 membros</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <CardTitle>Explore por Localização</CardTitle>
            </div>
            <CardDescription>
              Encontre eventos na sua cidade ou região.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">São Paulo, SP</p>
                <p className="text-xs text-muted-foreground">
                  +20 eventos esta semana
                </p>
              </div>
              <Badge variant="outline">Ver eventos</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Rio de Janeiro, RJ</p>
                <p className="text-xs text-muted-foreground">
                  +15 eventos esta semana
                </p>
              </div>
              <Badge variant="outline">Ver eventos</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">Belo Horizonte, MG</p>
                <p className="text-xs text-muted-foreground">
                  +12 eventos esta semana
                </p>
              </div>
              <Badge variant="outline">Ver eventos</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
