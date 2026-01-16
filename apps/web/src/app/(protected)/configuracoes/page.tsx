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
import { Settings, Users, DollarSign, Database, Plus, Trash2 } from "lucide-react";

const mockUsers = [
    {
        nome: "Maria Silva",
        email: "maria@akju.com",
        funcao: "Administrador",
        status: "Ativo",
    },
    {
        nome: "João Santos",
        email: "joao@akju.com",
        funcao: "Operador",
        status: "Ativo",
    },
    {
        nome: "Ana Costa",
        email: "ana@akju.com",
        funcao: "Visualizador",
        status: "Inativo",
    },
];

export default function Configuracoes() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
                <p className="text-muted-foreground">
                    Personalize o sistema conforme suas necessidades
                </p>
            </div>

            <Tabs defaultValue="usuarios" className="w-full">
                <TabsList className="grid w-full grid-cols-4 max-w-3xl">
                    <TabsTrigger value="usuarios" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Usuários
                    </TabsTrigger>
                    <TabsTrigger value="financeiro" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Financeiro
                    </TabsTrigger>
                    <TabsTrigger value="dados" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Dados
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

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Função</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockUsers.map((user, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{user.nome}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{user.funcao}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {user.status === "Ativo" ? (
                                                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                                                        Ativo
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Inativo</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="ghost" size="sm">
                                                    Editar
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-destructive">
                                                    Remover
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Permissões por Função</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-secondary rounded-lg">
                                <p className="font-semibold mb-2">Administrador</p>
                                <p className="text-sm text-muted-foreground">
                                    Acesso total ao sistema, incluindo configurações e gestão de usuários
                                </p>
                            </div>
                            <div className="p-4 bg-secondary rounded-lg">
                                <p className="font-semibold mb-2">Operador</p>
                                <p className="text-sm text-muted-foreground">
                                    Pode registrar produção, preencher checklists e visualizar relatórios
                                </p>
                            </div>
                            <div className="p-4 bg-secondary rounded-lg">
                                <p className="font-semibold mb-2">Visualizador</p>
                                <p className="text-sm text-muted-foreground">
                                    Apenas visualização de dados e relatórios
                                </p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="financeiro" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Parâmetros Financeiros</h3>
                        <div className="space-y-4">
                            <div>
                                <Label>Custo de Mão de Obra por Minuto (R$)</Label>
                                <Input type="number" step="0.01" placeholder="0,00" defaultValue="0.50" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Usado para calcular o custo de produção
                                </p>
                            </div>

                            <div>
                                <Label>Margem de Lucro Padrão (%)</Label>
                                <Input type="number" placeholder="0" defaultValue="40" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Margem sugerida para precificação
                                </p>
                            </div>

                            <div>
                                <Label>Percentual de Custo Fixo no Produto (%)</Label>
                                <Input type="number" placeholder="0" defaultValue="15" />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Quanto do custo fixo é rateado por produto
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Distribuição de Lucro (Caixinhas)
                        </h3>
                        <div className="space-y-4">
                            {[
                                { nome: "Reinvestimento", percentual: 30 },
                                { nome: "Marketing", percentual: 20 },
                                { nome: "Caixa de Segurança", percentual: 25 },
                                { nome: "Expansão", percentual: 15 },
                                { nome: "Salário Empresarial", percentual: 10 },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <Label className="flex-1">{item.nome}</Label>
                                    <Input
                                        type="number"
                                        className="w-24"
                                        defaultValue={item.percentual}
                                    />
                                    <span className="text-muted-foreground">%</span>
                                </div>
                            ))}
                            <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Total: 100% (deve somar exatamente 100%)
                                </p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="dados" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Gestão de Receitas Base</h3>
                        <div className="space-y-2 mb-4">
                            {["Brigadeiro Gourmet", "Bolo de Chocolate", "Torta de Limão"].map(
                                (receita, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                    >
                                        <span className="font-medium">{receita}</span>
                                        <div className="space-x-2">
                                            <Button variant="ghost" size="sm">
                                                Editar
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Nova Receita Base
                        </Button>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Gestão de Categorias</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label>Categorias de Produtos</Label>
                                <div className="space-y-2 mt-2">
                                    {["Bolos", "Doces", "Tortas", "Salgados"].map((cat, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-secondary rounded"
                                        >
                                            <span className="text-sm">{cat}</span>
                                            <Button variant="ghost" size="sm">
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <Label>Categorias de Estoque</Label>
                                <div className="space-y-2 mt-2">
                                    {["Ingredientes Secos", "Laticínios", "Frutas"].map(
                                        (cat, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between p-2 bg-secondary rounded"
                                            >
                                                <span className="text-sm">{cat}</span>
                                                <Button variant="ghost" size="sm">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
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
