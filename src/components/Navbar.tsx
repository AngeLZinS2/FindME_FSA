
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, UserCircle, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useSupabaseAuth();

  const handleLogout = async () => {
    await signOut();
    setIsMenuOpen(false);
  };

  const navigation = [
    { name: "Início", path: "/" },
    { name: "Eventos", path: "/eventos" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="border-b py-4 sticky top-0 bg-background z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? "active-nav-link" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="max-w-[100px] truncate">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="flex items-center cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2">
                  <User size={16} />
                  Entrar
                </Button>
              </Link>
              <Link to="/registro">
                <Button>Cadastrar</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-3 border-t">
          <div className="space-y-1 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block py-2 px-3 rounded-md ${
                  isActive(item.path) ? "bg-accent font-medium" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Link 
                    to="/perfil" 
                    className="flex w-full items-center gap-2 py-2 px-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircle className="h-4 w-4" />
                    Meu Perfil
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 py-2 px-3 text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <User size={16} />
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/registro" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Cadastrar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
