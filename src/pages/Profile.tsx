import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, LogOut, User, Calendar, CalendarPlus } from "lucide-react";

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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import EventCreationForm from "@/components/EventCreationForm";
import UserEvents from "@/components/UserEvents";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

// Esquema de validação para o formulário de perfil
const profileSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Digite um email válido"),
  phone: z.string().optional(),
  city: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading, signOut, updateProfile } = useSupabaseAuth();
  const defaultTab = searchParams.get("tab") || "profile";

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
    },
    values: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      city: user?.city || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const { error } = await updateProfile(data);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o perfil.",
      });
    } else {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao sair",
        description: "Não foi possível fazer logout.",
      });
    } else {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Aguardando redirecionamento ou carregando
  }

  const isCreator = user.userType === "creator";

  return (
    <div className="container mx-auto py-12">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              {isCreator && (
                <Badge className="mt-2" variant="secondary">Criador de Eventos</Badge>
              )}
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full mb-2" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex-1">
          <Tabs defaultValue={defaultTab}>
            <TabsList className={`grid w-full ${isCreator ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="events">Meus Eventos</TabsTrigger>
              {isCreator && (
                <TabsTrigger value="create">Criar Evento</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações pessoais aqui
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
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome" {...field} />
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
                              <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(xx) xxxxx-xxxx" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Sua cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" /> Salvar alterações
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Eventos</CardTitle>
                  <CardDescription>
                    {isCreator 
                      ? "Eventos criados por você" 
                      : "Eventos que você demonstrou interesse ou está participando"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isCreator ? (
                    <UserEvents />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Calendar className="mx-auto h-12 w-12 mb-4" />
                      <p>Você ainda não participou de nenhum evento</p>
                      <Button variant="link" onClick={() => navigate("/eventos")}>
                        Explorar Eventos
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {isCreator && (
              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Novo Evento</CardTitle>
                    <CardDescription>
                      Preencha os detalhes para publicar um novo evento
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EventCreationForm 
                      onSuccess={() => {
                        navigate("/perfil?tab=events");
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
