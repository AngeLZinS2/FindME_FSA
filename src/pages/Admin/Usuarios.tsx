import React, { useState, useEffect } from "react";
import { User, UserPlus, Edit, Trash2, Check, X } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

// Schema de validação para o formulário de usuário
const usuarioSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  cargo: z.string().min(2, "Informe o cargo do administrador"),
});

type UsuarioFormValues = z.infer<typeof usuarioSchema>;

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

const AdminUsuarios = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  
  const { toast } = useToast();

  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(usuarioSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      cargo: "",
    },
  });

  // Buscar administradores do banco de dados
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar administradores:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível carregar os administradores.",
        });
        return;
      }

      setAdmins(data || []);
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro inesperado ao carregar administradores.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openEditDialog = (admin: AdminUser) => {
    setEditingAdmin(admin);
    form.reset({
      nome: admin.name,
      email: admin.email,
      senha: "", // Não preenchemos a senha por segurança
      cargo: admin.role,
    });
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingAdmin(null);
    form.reset({
      nome: "",
      email: "",
      senha: "",
      cargo: "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: UsuarioFormValues) => {
    try {
      if (editingAdmin) {
        // Editar administrador existente
        const updateData = {
          name: data.nome,
          email: data.email,
          role: data.cargo,
        };

        // Se uma nova senha foi fornecida, incluir o hash
        if (data.senha.trim()) {
          // Usar a função do PostgreSQL para hash da senha
          const { error: updateError } = await (supabase.rpc as any)('update_admin_password', {
            admin_id: editingAdmin.id,
            new_password: data.senha,
            update_data: updateData
          });

          if (updateError) {
            console.error('Erro ao atualizar administrador:', updateError);
            toast({
              variant: "destructive",
              title: "Erro",
              description: "Não foi possível atualizar o administrador.",
            });
            return;
          }
        } else {
          // Atualizar apenas os dados básicos
          const { error: updateError } = await supabase
            .from('admin_users')
            .update(updateData)
            .eq('id', editingAdmin.id);

          if (updateError) {
            console.error('Erro ao atualizar administrador:', updateError);
            toast({
              variant: "destructive",
              title: "Erro",
              description: "Não foi possível atualizar o administrador.",
            });
            return;
          }
        }
        
        toast({
          title: "Usuário atualizado",
          description: `O perfil de ${data.nome} foi atualizado com sucesso.`,
        });
      } else {
        // Adicionar novo administrador
        const { error: insertError } = await (supabase.rpc as any)('create_admin_user', {
          admin_email: data.email,
          admin_name: data.nome,
          admin_role: data.cargo,
          admin_password: data.senha
        });

        if (insertError) {
          console.error('Erro ao criar administrador:', insertError);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível criar o administrador. Verifique se o email já não está em uso.",
          });
          return;
        }
        
        toast({
          title: "Administrador criado",
          description: `${data.nome} foi adicionado como administrador.`,
        });
      }
      
      setIsDialogOpen(false);
      fetchAdmins(); // Recarregar a lista
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro inesperado ao processar a solicitação.",
      });
    }
  };

  const deleteAdmin = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir administrador:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível excluir o administrador.",
        });
        return;
      }
      
      toast({
        title: "Administrador removido",
        description: "O administrador foi removido do sistema.",
        variant: "destructive",
      });
      
      fetchAdmins(); // Recarregar a lista
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro inesperado ao excluir administrador.",
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      const { error } = await supabase
        .from('admin_users')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Erro ao alterar status:', error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível alterar o status do administrador.",
        });
        return;
      }
      
      toast({
        title: "Status alterado",
        description: `O administrador agora está ${newStatus === "active" ? "Ativo" : "Inativo"}.`,
      });
      
      fetchAdmins(); // Recarregar a lista
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro inesperado ao alterar status.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando administradores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Administradores</h1>
          <p className="text-muted-foreground">
            Gerencie os usuários com acesso administrativo
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog}>
              <UserPlus className="mr-2 h-4 w-4" />
              Novo Administrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAdmin ? "Editar Administrador" : "Novo Administrador"}
              </DialogTitle>
              <DialogDescription>
                {editingAdmin
                  ? "Edite os dados do administrador selecionado"
                  : "Adicione um novo administrador ao sistema"}
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do administrador" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@findme.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {editingAdmin ? "Nova senha (deixe em branco para manter)" : "Senha"}
                      </FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input placeholder="Cargo ou função" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">
                    {editingAdmin ? "Salvar alterações" : "Criar administrador"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-accent/50">
                <th className="px-4 py-3 text-left">Nome</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Cargo</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-t hover:bg-accent/10">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div>{admin.name}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{admin.role}</td>
                  <td className="px-4 py-3">
                    <Badge 
                      variant={admin.status === "active" ? "default" : "secondary"}
                    >
                      {admin.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(admin)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      
                      <Button
                        variant={admin.status === "active" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleStatus(admin.id, admin.status)}
                      >
                        {admin.status === "active" ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {admin.status === "active" ? "Desativar" : "Ativar"}
                        </span>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Excluir administrador
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir permanentemente o administrador{" "}
                              <strong>{admin.name}</strong>? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteAdmin(admin.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {admins.length === 0 && (
        <div className="text-center py-8">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            Nenhum administrador encontrado
          </h3>
          <p className="text-sm text-muted-foreground">
            Adicione o primeiro administrador ao sistema.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
