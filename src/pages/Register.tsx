import React from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useMockAuth } from "@/hooks/useMockAuth";

const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  userType: z.enum(["attendee", "creator"], {
    required_error: "Selecione o tipo de usuário",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não conferem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signUp, loading } = useMockAuth();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "attendee",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const { error } = await signUp(data.email, data.password, data.name, data.userType);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: error.message || "Ocorreu um erro ao criar sua conta",
      });
    } else {
      toast({
        title: "Registro concluído",
        description: `Bem-vindo(a), ${data.name}!`,
      });
      navigate("/perfil");
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Criar uma conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para se cadastrar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-name">Nome completo</FormLabel>
                      <FormControl>
                        <Input 
                          id="register-name"
                          name="name"
                          placeholder="Seu nome" 
                          {...field} 
                        />
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
                      <FormLabel htmlFor="register-email">Email</FormLabel>
                      <FormControl>
                        <Input 
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="seu@email.com" 
                          {...field} 
                        />
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
                      <FormLabel htmlFor="register-password">Senha</FormLabel>
                      <FormControl>
                        <Input 
                          id="register-password"
                          name="password"
                          type="password" 
                          placeholder="••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-confirm-password">Confirme a senha</FormLabel>
                      <FormControl>
                        <Input 
                          id="register-confirm-password"
                          name="confirmPassword"
                          type="password" 
                          placeholder="••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="register-user-type">Tipo de conta</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger id="register-user-type" name="userType">
                            <SelectValue placeholder="Selecione o tipo de conta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="attendee">Participante de Eventos</SelectItem>
                          <SelectItem value="creator">Criador de Eventos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  <UserPlus className="mr-2 h-4 w-4" /> Registrar
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-center w-full">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
