
import React from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/Logo";

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
      <section className="bg-accent/50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Descubra <span className="text-findme-accent">Eventos Locais</span> Perto de Você
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Participe de eventos, crie experiências memoráveis e construa conexões com o FindMe.
              </p>
              
              <div className="relative max-w-md">
                <Input 
                  placeholder="Buscar eventos..." 
                  className="pl-10 pr-4 py-6 text-base" 
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link to="/eventos">Ver Todos os Eventos</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/create-event">Criar Evento</Link>
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                <div className="aspect-[3/4] rounded-lg bg-gradient-to-br from-primary to-findme-accent opacity-10 absolute -top-4 -left-4 w-full h-full"></div>
                <div className="rounded-lg overflow-hidden relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" 
                    alt="Eventos" 
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-background p-3 rounded-lg shadow-lg z-20 max-w-[200px]">
                  <div className="flex items-center gap-2 font-medium">
                    <MapPin size={14} className="text-findme-accent" />
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

      {/* Categories Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Explorar por Categoria</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categoryIcons.map((category) => (
              <Link to={`/eventos?category=${category.name}`} key={category.name}>
                <div className="bg-background hover:shadow-md border rounded-lg p-4 text-center transition-all hover:-translate-y-1">
                  <span className="text-4xl mb-2 block">{category.icon}</span>
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
            <div className="text-center p-6">
              <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Descubra Eventos</h3>
              <p className="text-muted-foreground">Navegue por eventos locais próximos de você com base em seus interesses.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Participe ou Crie</h3>
              <p className="text-muted-foreground">Registre-se em eventos do seu interesse ou crie seu próprio evento único.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Conecte-se</h3>
              <p className="text-muted-foreground">Conheça novas pessoas, amplie sua rede e crie experiências memoráveis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
            <Logo size="lg" />
            <h2 className="text-3xl md:text-4xl font-bold my-6">Pronto para descobrir seu próximo evento?</h2>
            <p className="text-lg mb-8">
              Junte-se a milhares de pessoas encontrando e criando eventos incríveis todos os dias.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/eventos">Encontrar Eventos</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
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
