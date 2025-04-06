
import React, { useState } from "react";
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

// Schema de validação para o formulário de usuário
const usuarioSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  cargo: z.string().min(2, "Informe o cargo do administrador"),
});

type UsuarioFormValues = z.infer<typeof usuarioSchema>;

// Dados mockados dos administradores
const initialAdmins = [
  { id: 1, nome: "Administrador Principal", email: "admin@findme.com", cargo: "Administrador Geral", status: "Ativo" },
  { id: 2, nome: "Fernanda Souza", email: "fernanda@findme.com", cargo: "Moderador de Eventos", status: "Ativo" },
  { id: 3, nome: "Carlos Eduardo", email: "carlos@findme.com", cargo: "Analista de Conteúdo", status: "Inativo" },
];

const AdminUsuarios = () => {
  const [admins, setAdmins] = useState(initialAdmins);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<typeof initialAdmins[0] | null>(null);
  
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

  const openEditDialog = (admin: typeof initialAdmins[0]) => {
    setEditingAdmin(admin);
    form.reset({
      nome: admin.nome,
      email: admin.email,
      senha: "", // Não preenchemos a senha por segurança
      cargo: admin.cargo,
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

  const onSubmit = (data: UsuarioFormValues) => {
    if (editingAdmin) {
      // Editar administrador existente
      setAdmins(
        admins.map((admin) =>
          admin.id === editingAdmin.id
            ? { 
                ...admin, 
                nome: data.nome, 
                email: data.email, 
                cargo: data.cargo 
              }
            : admin
        )
      );
      
      toast({
        title: "Usuário atualizado",
        description: `O perfil de ${data.nome} foi atualizado com sucesso.`,
      });
    } else {
      // Adicionar novo administrador
      const newAdmin = {
        id: admins.length > 0 ? Math.max(...admins.map((a) => a.id)) + 1 : 1,
        nome: data.nome,
        email: data.email,
        cargo: data.cargo,
        status: "Ativo",
      };
      
      setAdmins([...admins, newAdmin]);
      
      toast({
        title: "Administrador criado",
        description: `${data.nome} foi adicionado como administrador.`,
      });
    }
    
    setIsDialogOpen(false);
  };

  const deleteAdmin = (id: number) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
    
    toast({
      title: "Administrador removido",
      description: "O administrador foi removido do sistema.",
      variant: "destructive",
    });
  };

  const toggleStatus = (id: number) => {
    setAdmins(
      admins.map((admin) =>
        admin.id === id
          ? { 
              ...admin, 
              status: admin.status === "Ativo" ? "Inativo" : "Ativo" 
            }
          : admin
      )
    );
    
    const admin = admins.find((a) => a.id === id);
    const newStatus = admin?.status === "Ativo" ? "Inativo" : "Ativo";
    
    toast({
      title: "Status alterado",
      description: `O administrador agora está ${newStatus}.`,
    });
  };

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
                      <div>{admin.nome}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{admin.email}</td>
                  <td className="px-4 py-3">{admin.cargo}</td>
                  <td className="px-4 py-3">
                    <Badge 
                      variant={admin.status === "Ativo" ? "default" : "secondary"}
                    >
                      {admin.status}
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
                        variant={admin.status === "Ativo" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleStatus(admin.id)}
                      >
                        {admin.status === "Ativo" ? (
                          <X className="h-4 w-4" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {admin.status === "Ativo" ? "Desativar" : "Ativar"}
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
                              <strong>{admin.nome}</strong>? Esta ação não pode ser desfeita.
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
    </div>
  );
};

export default AdminUsuarios;
