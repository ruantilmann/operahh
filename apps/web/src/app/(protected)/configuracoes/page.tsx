"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Settings, Users, Plus, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc, client } from "@/utils/orpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Configuracoes() {
    const [editingUser, setEditingUser] = useState<string | null>(null);
    const [editForm, setEditForm] = useState({ name: "", email: "" });

    const queryClient = useQueryClient();

    const { data: users, isLoading, error } = useQuery(orpc.settings.getAllUsers.queryOptions());

    const updateUserMutation = useMutation({
        mutationFn: async ({ userId, data }: { userId: string; data: { name?: string; email?: string } }) => {
            // Usar o cliente orpc diretamente para fazer a mutation
            return await client.settings.updateUser({
                userId,
                name: data.name,
                email: data.email,
            });
        },
        onSuccess: () => {
            toast.success("Usuário atualizado com sucesso!");
            queryClient.invalidateQueries({ queryKey: orpc.settings.getAllUsers.queryKey() });
            setEditingUser(null);
        },
        onError: (error) => {
            toast.error("Erro ao atualizar usuário: " + error.message);
        },
    });

    const handleEdit = (user: any) => {
        setEditingUser(user.id);
        setEditForm({ name: user.name, email: user.email });
    };

    const handleSave = (userId: string) => {
        updateUserMutation.mutate({ userId, data: editForm });
    };

    const handleCancel = () => {
        setEditingUser(null);
        setEditForm({ name: "", email: "" });
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
                <p className="text-muted-foreground">
                    Personalize o sistema conforme suas necessidades
                </p>
            </div>

            <Tabs defaultValue="usuarios" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="usuarios" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Usuários
                    </TabsTrigger>
                    <TabsTrigger value="geral" className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Geral
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="usuarios" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Gerenciar Usuários</h3>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Novo Usuário
                            </Button>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-4">Carregando usuários...</div>
                        ) : error ? (
                            <div className="text-center py-4 text-destructive">Erro ao carregar usuários</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users?.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">
                                                    {editingUser === user.id ? (
                                                        <Input
                                                            value={editForm.name}
                                                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                                            placeholder="Nome"
                                                        />
                                                    ) : (
                                                        user.name
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {editingUser === user.id ? (
                                                        <Input
                                                            value={editForm.email}
                                                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                                            placeholder="Email"
                                                            type="email"
                                                        />
                                                    ) : (
                                                        user.email
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={user.emailVerified ? "default" : "secondary"}>
                                                        {user.emailVerified ? "Verificado" : "Pendente"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right space-x-2">
                                                    {editingUser === user.id ? (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleSave(user.id)}
                                                                disabled={updateUserMutation.isPending}
                                                            >
                                                                {updateUserMutation.isPending ? "Salvando..." : "Salvar"}
                                                            </Button>
                                                            <Button variant="ghost" size="sm" onClick={handleCancel}>
                                                                Cancelar
                                                            </Button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                                                                Editar
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="text-destructive">
                                                                Remover
                                                            </Button>
                                                        </>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Card>

                </TabsContent>

                <TabsContent value="geral" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Preferências do Sistema</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Notificações de Email</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Receber alertas por email
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Alertas de Estoque Baixo</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Notificar quando estoque estiver abaixo do mínimo
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Alertas de Validade</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Avisar sobre produtos próximos ao vencimento
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label>Modo Escuro</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Usar tema escuro no sistema
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Informações da Empresa</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Nome da Empresa</Label>
                                <Input defaultValue="AKJU Doceria" />
                            </div>
                            <div>
                                <Label>CNPJ</Label>
                                <Input placeholder="00.000.000/0000-00" />
                            </div>
                            <div>
                                <Label>Telefone</Label>
                                <Input placeholder="(00) 00000-0000" />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input type="email" defaultValue="contato@akju.com" />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Endereço</Label>
                                <Input placeholder="Endereço completo" />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button size="lg">Salvar Alterações</Button>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
