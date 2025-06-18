
import React from "react";
import { Calendar, Users, MapPin, Star, ArrowRight, Search, Code, Music, Palette, Gamepad2, GraduationCap, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import { useMockEventsList } from "@/hooks/useMockEventsList";

const Index = () => {
  const { events, loading } = useMockEventsList();

  const categories = [
    { name: "Tecnologia", icon: Code, color: "bg-blue-500" },
    { name: "Música", icon: Music, color: "bg-purple-500" },
    { name: "Arte", icon: Palette, color: "bg-pink-500" },
    { name: "Games", icon: Gamepad2, color: "bg-green-500" },
    { name: "Educação", icon: GraduationCap, color: "bg-orange-500" },
    { name: "Gastronomia", icon: Utensils, color: "bg-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Descubra <span className="text-blue-400">Eventos</span>
            <br />
            <span className="text-blue-400">Locais</span> Perto de Você
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Participe de eventos locais, uma experiências interessantes e conecte-se com pessoas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="search"
                placeholder="Buscar eventos..."
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Buscar Eventos
            </Button>
          </div>

          {/* Event Card Preview */}
          <div className="max-w-sm mx-auto">
            {loading ? (
              <EventCardSkeleton />
            ) : events.length > 0 ? (
              <EventCard event={events[0]} />
            ) : (
              <div className="bg-gray-800 rounded-lg p-6">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-400">Nenhum evento disponível</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Eventos Públicos Section */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Eventos Públicos</h2>
            <Link to="/eventos">
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                Ver todos
              </Button>
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
              <div className="col-span-3 text-center py-12">
                <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-400 text-lg">
                  Nenhum evento público disponível no momento.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Explorar por Categorias */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Explorar por Categorias</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`${category.color} rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-white">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como o FindMe Funciona */}
      <section className="py-16 px-4 bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Como o FindMe Funciona</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 text-center">
              <CardContent className="p-8">
                <div className="bg-blue-600 rounded-full p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Descubra Eventos</h3>
                <p className="text-gray-400">
                  Encontre eventos locais que correspondem aos seus interesses e hobbies próximos a você.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 text-center">
              <CardContent className="p-8">
                <div className="bg-green-600 rounded-full p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Participe ou Crie</h3>
                <p className="text-gray-400">
                  Registre-se em eventos que lhe interessam ou crie seu próprio evento facilmente.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 text-center">
              <CardContent className="p-8">
                <div className="bg-purple-600 rounded-full p-4 mx-auto mb-6 w-16 h-16 flex items-center justify-center">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Conecte-se</h3>
                <p className="text-gray-400">
                  Conheça pessoas, faça novos amigos e expanda sua rede social através de experiências compartilhadas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white text-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para descobrir seu próximo evento?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas descobrindo e criando eventos incríveis todos os dias.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/eventos">
                Explorar Eventos
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/registro">
                Criar Conta
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
