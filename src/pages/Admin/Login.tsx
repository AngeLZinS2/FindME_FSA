
import React from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, LogIn } from "lucide-react";

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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Credenciais dos administradores
const adminCredentials = {
  'admin@findme.com': 'admin123',
  'Angelo@findme.com': '13281520'
};

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log('Admin login attempt:', data.email);
    
    // Verificar credenciais locais primeiro
    const expectedPassword = adminCredentials[data.email as keyof typeof adminCredentials];
    
    if (!expectedPassword || data.password !== expectedPassword) {
      toast({
        variant: "destructive",
        title: "Falha na autenticação",
        description: "Email ou senha incorretos",
      });
      return;
    }

    // Verificar se usuário existe na tabela admin_users
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', data.email)
      .eq('status', 'active')
      .single();

    if (error || !adminUser) {
      console.error('Admin user not found:', error);
      toast({
        variant: "destructive",
        title: "Falha na autenticação",
        description: "Usuário administrador não encontrado ou inativo",
      });
      return;
    }

    // Login bem-sucedido
    localStorage.setItem("adminUser", JSON.stringify({ 
      email: adminUser.email, 
      name: adminUser.name,
      role: adminUser.role 
    }));
    
    toast({
      title: "Login bem-sucedido",
      description: `Bem-vindo(a), ${adminUser.name}!`,
    });
    
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto flex-grow flex items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6 bg-card p-8 rounded-lg border shadow">
          <div className="text-center space-y-2">
            <Shield className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-2xl font-bold">Área Administrativa</h1>
            <p className="text-muted-foreground">
              Entre com suas credenciais de administrador
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="admin@findme.com ou Angelo@findme.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg">
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </Button>
            </form>
          </Form>

          <div className="text-xs text-muted-foreground text-center">
            <p>Credenciais válidas:</p>
            <p>admin@findme.com - admin123</p>
            <p>Angelo@findme.com - 13281520</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
