
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

// Esquema de validação para o formulário de login
const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Dados de administradores mockados (em uma aplicação real, isso viria de um banco de dados)
const adminUsers = [
  { email: "admin@findme.com", password: "admin123", name: "Administrador Principal" }
];

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

  const onSubmit = (data: LoginFormValues) => {
    // Verificar se o usuário é um administrador
    const admin = adminUsers.find(
      (user) => user.email === data.email && user.password === data.password
    );

    if (admin) {
      // Em uma aplicação real, você armazenaria um token JWT ou similar
      localStorage.setItem("adminUser", JSON.stringify({ email: admin.email, name: admin.name }));
      
      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo(a), ${admin.name}!`,
      });
      
      navigate("/admin/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Falha na autenticação",
        description: "Email ou senha incorretos",
      });
    }
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
                      <Input placeholder="admin@findme.com" {...field} />
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
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
