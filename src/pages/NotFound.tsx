
import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4 py-16">
          <h1 className="text-8xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-6">Página Não Encontrada</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Desculpe, não conseguimos encontrar a página que você está procurando. A página pode ter sido removida ou a URL pode estar incorreta.
          </p>
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home size={18} />
              Voltar para o Início
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
