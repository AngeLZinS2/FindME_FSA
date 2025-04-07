
import React, { useEffect, useState } from "react";
import { 
  CalendarCheck, 
  Users, 
  AlertTriangle, 
  CheckCircle 
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ActivityLog {
  id: number;
  action: string;
  user: string;
  target: string;
  date: string;
}

const AdminDashboard = () => {
  // Estado para armazenar os dados do dashboard
  const [dashboardData, setDashboardData] = useState({
    totalEvents: 0,
    pendingEvents: 0,
    totalUsers: 0,
    recentActionLogs: [] as ActivityLog[]
  });
  
  const { toast } = useToast();

  // Buscar dados ao carregar o componente
  useEffect(() => {
    try {
      // Buscar eventos do localStorage
      const adminEvents = JSON.parse(localStorage.getItem("adminEvents") || "[]");
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const activityLogs = JSON.parse(localStorage.getItem("activityLogs") || "[]");
      
      // Calcular estatísticas
      const pendingEvents = adminEvents.filter((event: any) => event.status === "pendente").length;
      
      // Atualizar o estado com os dados calculados
      setDashboardData({
        totalEvents: adminEvents.length,
        pendingEvents: pendingEvents,
        totalUsers: users.length,
        recentActionLogs: activityLogs.slice(0, 10) // Pegar os 10 logs mais recentes
      });
      
      // Se não houver logs de atividade, criar alguns logs iniciais
      if (activityLogs.length === 0) {
        const initialLogs = [
          { id: 1, action: "Evento aprovado", user: "Admin", target: "Festival de Música", date: "12/04/2025" },
          { id: 2, action: "Usuário criado", user: "Admin", target: "Administrador Regional", date: "10/04/2025" },
          { id: 3, action: "Evento rejeitado", user: "Admin", target: "Reunião Suspeita", date: "08/04/2025" }
        ];
        
        localStorage.setItem("activityLogs", JSON.stringify(initialLogs));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Se não puder ser convertido, retorna a string original
    }
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema e ações administrativas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              eventos cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingEvents}</div>
            <p className="text-xs text-muted-foreground">
              aguardando aprovação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              usuários registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              dos eventos são aprovados
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs de Atividades</CardTitle>
          <CardDescription>
            Registro das ações administrativas recentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recentActionLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Ação</th>
                      <th className="text-left py-3 px-4">Administrador</th>
                      <th className="text-left py-3 px-4">Alvo</th>
                      <th className="text-left py-3 px-4">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentActionLogs.map((log) => (
                      <tr key={log.id} className="border-b">
                        <td className="py-3 px-4">{log.action}</td>
                        <td className="py-3 px-4">{log.user}</td>
                        <td className="py-3 px-4">{log.target}</td>
                        <td className="py-3 px-4">{formatDate(log.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhum log de atividade encontrado</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
