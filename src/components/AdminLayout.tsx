
import React from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  ChevronDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminLayout = () => {
  // Verificar se o usuário está autenticado como administrador
  const isAdminAuthenticated = () => {
    return localStorage.getItem("adminUser") !== null;
  };

  const adminUser = isAdminAuthenticated() 
    ? JSON.parse(localStorage.getItem("adminUser") || "{}") 
    : null;

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  // Se não estiver autenticado, redirecionar para a página de login
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r shadow-sm hidden md:block">
        <div className="p-6">
          <h2 className="text-lg font-bold">Admin FindMe</h2>
          <p className="text-sm text-muted-foreground">Painel administrativo</p>
        </div>

        <nav className="px-3 py-2 space-y-1">
          <Link to="/admin/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/admin/eventos">
            <Button variant="ghost" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Eventos
            </Button>
          </Link>
          <Link to="/admin/usuarios">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Usuários
            </Button>
          </Link>
          <Link to="/admin/configuracoes">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </Button>
          </Link>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-background flex items-center px-6 justify-between">
          <div className="md:hidden">
            <Button variant="outline" size="sm">
              Menu
            </Button>
          </div>
          
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <span>{adminUser?.name || "Administrador"}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
