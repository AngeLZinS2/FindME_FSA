
import React from "react";
import { Calendar, Users, MapPin, Search, ArrowRight, Sparkles, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import { useMockEventsList } from "@/hooks/useMockEventsList";

const Index = () => {
  const { events, loading } = useMockEventsList();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-50 rounded-full opacity-60"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-50 rounded-full opacity-40"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Encontre eventos
              <span className="block text-blue-600">na sua região</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 font-light">
              Descubra experiências únicas, conecte-se com pessoas e viva momentos especiais perto de você
            </p>
            
            <div className="max-w-2xl mx-auto mb-16">
              <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white rounded-2xl shadow-lg border">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="O que você procura?"
                    className="pl-12 border-0 text-lg h-14 focus-visible:ring-0"
                  />
                </div>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-8 text-lg">
                  <Link to="/eventos">
                    Buscar <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600">Eventos disponíveis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
                <div className="text-gray-600">Cidades cobertas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">10k+</div>
                <div className="text-gray-600">Pessoas conectadas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Eventos em Destaque */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Eventos em destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra os eventos mais populares e interessantes da sua região
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                <Calendar className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">
                  Nenhum evento disponível no momento
                </p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="border-2">
              <Link to="/eventos">
                Ver todos os eventos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Como funciona o FindMe
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Três passos simples para descobrir e participar de eventos incríveis
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">1. Descubra</h3>
              <p className="text-gray-600 text-lg">
                Busque eventos por localização, categoria ou interesse pessoal
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">2. Participe</h3>
              <p className="text-gray-600 text-lg">
                Confirme sua presença nos eventos que mais te interessam
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">3. Conecte-se</h3>
              <p className="text-gray-600 text-lg">
                Conheça pessoas novas e crie conexões através de experiências compartilhadas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="h-16 w-16 text-white mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Pronto para sua próxima aventura?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se a milhares de pessoas descobrindo eventos incríveis todos os dias
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg h-14 px-8">
                <Link to="/eventos">
                  Explorar Eventos
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg h-14 px-8">
                <Link to="/registro">
                  Criar Conta Grátis
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
