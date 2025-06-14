
import React from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";
import NearbyEvents from "@/components/NearbyEvents";

const categoryIcons = [
  { name: "Música", icon: "🎵" },
  { name: "Esportes", icon: "⚽" },
  { name: "Tecnologia", icon: "💻" },
  { name: "Gastronomia", icon: "🍲" },
  { name: "Arte", icon: "🎨" },
  { name: "Networking", icon: "🤝" },
];

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-accent/50 py-16 md:py-24 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating event icons */}
          <div className="absolute top-20 left-10 text-4xl animate-bounce opacity-20" style={{ animationDelay: '0s', animationDuration: '3s' }}>🎪</div>
          <div className="absolute top-32 right-20 text-3xl animate-bounce opacity-20" style={{ animationDelay: '1s', animationDuration: '4s' }}>🎭</div>
          <div className="absolute bottom-32 left-20 text-3xl animate-bounce opacity-20" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>🎪</div>
          <div className="absolute bottom-20 right-32 text-4xl animate-bounce opacity-20" style={{ animationDelay: '0.5s', animationDuration: '3.2s' }}>🎨</div>
          <div className="absolute top-1/2 left-1/4 text-2xl animate-bounce opacity-15" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}>🎵</div>
          <div className="absolute top-1/3 right-1/3 text-3xl animate-bounce opacity-15" style={{ animationDelay: '2.5s', animationDuration: '3.8s' }}>⚽</div>
          
          {/* Pulsing circles */}
          <div className="absolute top-16 left-1/3 w-24 h-24 bg-findme-accent/10 rounded-full animate-ping opacity-30" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-24 right-1/4 w-32 h-32 bg-primary/10 rounded-full animate-ping opacity-20" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute top-1/2 right-10 w-20 h-20 bg-findme-accent/15 rounded-full animate-ping opacity-25" style={{ animationDelay: '1s', animationDuration: '3.5s' }}></div>
          
          {/* Moving gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Descubra <span className="text-findme-accent animate-pulse-gentle">Eventos Locais</span> Perto de Você
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Participe de eventos, crie experiências memoráveis e construa conexões com o FindMe.
              </p>
              
              <div className="relative max-w-md group">
                <Input 
                  placeholder="Buscar eventos..." 
                  className="pl-10 pr-4 py-6 text-base transition-all duration-300 group-hover:shadow-lg" 
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-findme-accent" size={18} />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button asChild className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  <Link to="/eventos">Ver Todos os Eventos</Link>
                </Button>
                <Button variant="outline" asChild className="transform transition-all duration-200 hover:scale-105 hover:shadow-lg">
                  <Link to="/create-event">Criar Evento</Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center animate-fade-in">
              <div className="relative w-full max-w-md">
                <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary to-findme-accent opacity-10 absolute -top-4 -left-4 w-full h-full animate-pulse-gentle"></div>
                <div className="rounded-lg overflow-hidden relative z-10 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" 
                    alt="Eventos" 
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-background p-3 rounded-lg shadow-lg z-20 max-w-[200px] animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin size={14} className="text-findme-accent animate-pulse" />
                    <span className="text-sm">Eventos em Alta Perto de Você</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Mais de 250+ eventos acontecendo este mês
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Events Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <NearbyEvents />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Explorar por Categoria</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categoryIcons.map((category, index) => (
              <Link to={`/eventos?category=${category.name}`} key={category.name}>
                <div className="bg-background hover:shadow-md border rounded-lg p-4 text-center transition-all duration-300 hover:-translate-y-2 hover:scale-105 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="text-4xl mb-2 block transition-transform duration-300 hover:scale-110">{category.icon}</span>
                  <h3 className="font-medium">{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Como o FindMe Funciona</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 transform transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-accent/70 hover:scale-110">
                <Search size={24} className="transition-transform duration-300 hover:rotate-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Descubra Eventos</h3>
              <p className="text-muted-foreground">Navegue por eventos locais próximos de você com base em seus interesses.</p>
            </div>
            
            <div className="text-center p-6 transform transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-accent/70 hover:scale-110">
                <Calendar size={24} className="transition-transform duration-300 hover:rotate-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Participe ou Crie</h3>
              <p className="text-muted-foreground">Registre-se em eventos do seu interesse ou crie seu próprio evento único.</p>
            </div>
            
            <div className="text-center p-6 transform transition-all duration-500 hover:scale-105 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:bg-accent/70 hover:scale-110">
                <Users size={24} className="transition-transform duration-300 hover:rotate-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conecte-se</h3>
              <p className="text-muted-foreground">Conheça novas pessoas, amplie sua rede e crie experiências memoráveis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Animated background for CTA */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-ping opacity-30" style={{ animationDuration: '4s' }}></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/5 rounded-full animate-ping opacity-40" style={{ animationDelay: '2s', animationDuration: '3s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-ping opacity-50" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <div className="transform transition-all duration-500 hover:scale-110">
              <Logo size="lg" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold my-6 animate-fade-in">Pronto para descobrir seu próximo evento?</h2>
            <p className="text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Junte-se a milhares de pessoas encontrando e criando eventos incríveis todos os dias.
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" variant="secondary" asChild className="transform transition-all duration-200 hover:scale-105">
                <Link to="/eventos">Encontrar Eventos</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="transform transition-all duration-200 hover:scale-105">
                <Link to="/register">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
