
import React from "react";
import { 
  CalendarCheck, 
  Users, 
  AlertTriangle, 
  CheckCircle 
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  // Dados mockados para o dashboard
  const dashboardData = {
    totalEvents: 128,
    pendingEvents: 12,
    totalUsers: 543,
    recentActionLogs: [
      { id: 1, action: "Evento aprovado", user: "Admin", target: "Festival de Música", date: "12/04/2025" },
      { id: 2, action: "Usuário criado", user: "Admin", target: "Administrador Regional", date: "10/04/2025" },
      { id: 3, action: "Evento rejeitado", user: "Admin", target: "Reunião Suspeita", date: "08/04/2025" },
    ]
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
                      <td className="py-3 px-4">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
