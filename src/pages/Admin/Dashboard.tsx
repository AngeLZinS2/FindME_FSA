
import React, { useEffect, useState } from "react";
import { 
  CalendarCheck, 
  Users, 
  AlertTriangle, 
  CheckCircle 
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  target: string;
  date: string;
}

interface DashboardStats {
  totalEvents: number;
  pendingEvents: number;
  totalUsers: number;
  approvalRate: number;
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardStats>({
    totalEvents: 0,
    pendingEvents: 0,
    totalUsers: 0,
    approvalRate: 0
  });
  
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();

  // Buscar estatísticas do dashboard
  const fetchDashboardStats = async () => {
    try {
      console.log('🔍 Buscando estatísticas do dashboard...');
      
      // Buscar todos os eventos
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*');

      if (eventsError) {
        console.error('❌ Erro ao buscar eventos:', eventsError);
        throw eventsError;
      }

      // Buscar todos os usuários
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*');

      if (usersError) {
        console.error('❌ Erro ao buscar usuários:', usersError);
        throw usersError;
      }

      console.log('📊 Dados encontrados:', {
        totalEvents: events?.length || 0,
        totalUsers: users?.length || 0
      });

      // Calcular estatísticas
      const totalEvents = events?.length || 0;
      const pendingEvents = events?.filter(event => event.status === 'pending').length || 0;
      const approvedEvents = events?.filter(event => event.status === 'approved').length || 0;
      const totalUsers = users?.length || 0;
      const approvalRate = totalEvents > 0 ? Math.round((approvedEvents / totalEvents) * 100) : 0;

      setDashboardData({
        totalEvents,
        pendingEvents,
        totalUsers,
        approvalRate
      });

      console.log('✅ Estatísticas calculadas:', {
        totalEvents,
        pendingEvents,
        totalUsers,
        approvalRate
      });

    } catch (error) {
      console.error("❌ Erro ao carregar estatísticas do dashboard:", error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar as estatísticas do dashboard.",
        variant: "destructive"
      });
    }
  };

  // Buscar logs de atividades (usando eventos recentes como exemplo)
  const fetchActivityLogs = async () => {
    try {
      console.log('🔍 Buscando logs de atividades...');
      
      const { data: recentEvents, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Erro ao buscar logs:', error);
        throw error;
      }

      // Converter eventos em logs de atividade
      const logs: ActivityLog[] = recentEvents?.map(event => ({
        id: event.id,
        action: event.status === 'approved' ? 'Evento aprovado' : 
                event.status === 'rejected' ? 'Evento rejeitado' : 'Evento criado',
        user: 'Admin',
        target: event.title,
        date: new Date(event.created_at || '').toLocaleDateString('pt-BR')
      })) || [];

      setActivityLogs(logs);
      console.log('✅ Logs de atividades carregados:', logs.length);

    } catch (error) {
      console.error("❌ Erro ao carregar logs de atividades:", error);
    }
  };

  // Carregar todos os dados ao montar o componente
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      await Promise.all([
        fetchDashboardStats(),
        fetchActivityLogs()
      ]);
      setLoading(false);
    };

    loadDashboardData();
  }, [toast]);

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
            <div className="text-2xl font-bold">
              {loading ? "..." : dashboardData.totalEvents}
            </div>
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
            <div className="text-2xl font-bold">
              {loading ? "..." : dashboardData.pendingEvents}
            </div>
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
            <div className="text-2xl font-bold">
              {loading ? "..." : dashboardData.totalUsers}
            </div>
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
            <div className="text-2xl font-bold">
              {loading ? "..." : `${dashboardData.approvalRate}%`}
            </div>
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Carregando logs de atividades...</p>
              </div>
            ) : activityLogs.length > 0 ? (
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
                    {activityLogs.map((log) => (
                      <tr key={log.id} className="border-b">
                        <td className="py-3 px-4">{log.action}</td>
                        <td className="py-3 px-4">{log.user}</td>
                        <td className="py-3 px-4">{log.target}</td>
                        <td className="py-3 px-4">{log.date}</td>
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
