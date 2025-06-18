
import React from "react";
import { Calendar, Users, MapPin, Star, ArrowRight, Sparkles, Zap, Heart } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto py-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Descubra Eventos
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Incríveis
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Conecte-se com experiências únicas, pessoas especiais e momentos inesquecíveis na sua região
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
                <Link to="/eventos">
                  <Zap className="mr-2 h-5 w-5" />
                  Explorar Eventos
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-3">
                <Link to="/registro">
                  <Heart className="mr-2 h-5 w-5" />
                  Criar Conta
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-400 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400 rounded-full opacity-20 animate-pulse delay-500"></div>
      </section>

      <div className="container mx-auto py-16 px-4 space-y-16">
        {/* Featured Events Section */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Eventos em Destaque
              <Sparkles className="inline-block h-8 w-8 ml-2 text-yellow-500" />
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Selecionamos os melhores eventos para você viver experiências extraordinárias
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
              <div className="col-span-3 text-center py-12">
                <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                  <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">
                    Nenhum evento em destaque no momento.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Link to="/eventos">
                Ver todos os eventos <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Nearby Events Section */}
        <section>
          <NearbyEvents />
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-2 gap-8">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Comunidades Ativas</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Participe de grupos e comunidades para expandir seu network e fazer novos amigos.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Devs do Brasil</p>
                  <p className="text-sm text-gray-600">
                    Comunidade de desenvolvedores apaixonados por tecnologia
                  </p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">540 membros</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Amantes da Gastronomia</p>
                  <p className="text-sm text-gray-600">
                    Compartilhe receitas e descubra novos sabores
                  </p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">320 membros</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Artistas Visuais BR</p>
                  <p className="text-sm text-gray-600">
                    Espaço para artistas mostrarem seus trabalhos
                  </p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">280 membros</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Explore por Localização</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Encontre eventos incríveis na sua cidade ou região preferida.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">São Paulo, SP</p>
                  <p className="text-sm text-gray-600">
                    A cidade que nunca para, sempre com novidades
                  </p>
                </div>
                <Badge variant="outline" className="border-blue-200 text-blue-700">+20 eventos</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Rio de Janeiro, RJ</p>
                  <p className="text-sm text-gray-600">
                    Cidade maravilhosa com eventos únicos
                  </p>
                </div>
                <Badge variant="outline" className="border-blue-200 text-blue-700">+15 eventos</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-900">Belo Horizonte, MG</p>
                  <p className="text-sm text-gray-600">
                    Capital mineira cheia de cultura e arte
                  </p>
                </div>
                <Badge variant="outline" className="border-blue-200 text-blue-700">+12 eventos</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Junte-se à Nossa Comunidade</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-purple-200">Eventos Realizados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-purple-200">Pessoas Conectadas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-purple-200">Cidades Atendidas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-purple-200">Satisfação</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
