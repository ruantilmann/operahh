"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Component, Calculator, Plus, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const mockRecipes = [
    {
        nome: "Brigadeiro Gourmet",
        rendimento: "50 unid",
        tempo: "45 min",
        custoUnitario: "R$ 1,20",
    },
    {
        nome: "Bolo de Chocolate",
        rendimento: "12 fatias",
        tempo: "120 min",
        custoUnitario: "R$ 8,50",
    },
];

export default function Precificacao() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Precificação</h1>
                <p className="text-muted-foreground">
                    Gerencie receitas e calcule preços de forma precisa
                </p>
            </div>

            <Tabs defaultValue="receitas" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-2xl">
                    <TabsTrigger value="receitas" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Receitas
                    </TabsTrigger>
                    <TabsTrigger value="componentes" className="flex items-center gap-2">
                        <Component className="h-4 w-4" />
                        Componentes
                    </TabsTrigger>
                    <TabsTrigger value="calculo" className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Calcular Preço
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="receitas" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Banco de Receitas</h3>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Nova Receita
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Rendimento</TableHead>
                                        <TableHead>Tempo Total</TableHead>
                                        <TableHead>Custo/Unidade</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockRecipes.map((recipe, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{recipe.nome}</TableCell>
                                            <TableCell>{recipe.rendimento}</TableCell>
                                            <TableCell>{recipe.tempo}</TableCell>
                                            <TableCell className="font-semibold">
                                                {recipe.custoUnitario}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    Editar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Adicionar Nova Receita</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Nome da Receita</Label>
                                    <Input placeholder="Ex: Brigadeiro Gourmet" />
                                </div>
                                <div>
                                    <Label>Rendimento</Label>
                                    <Input placeholder="Ex: 50 unidades" />
                                </div>
                                <div>
                                    <Label>Tempo Total (minutos)</Label>
                                    <Input type="number" placeholder="0" />
                                </div>
                                <div>
                                    <Label>Custo de Mão de Obra (R$/min)</Label>
                                    <Input type="number" step="0.01" placeholder="0.00" />
                                </div>
                            </div>

                            <div>
                                <Label className="mb-2 block">Ingredientes</Label>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-3 gap-2">
                                        <Input placeholder="Ingrediente" />
                                        <Input placeholder="Quantidade" />
                                        <div className="flex gap-2">
                                            <Input placeholder="Custo" />
                                            <Button variant="destructive" size="icon">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Adicionar Ingrediente
                                    </Button>
                                </div>
                            </div>

                            <div className="bg-secondary p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Custo Total</p>
                                        <p className="text-2xl font-bold text-foreground">R$ 60,00</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Custo por Unidade</p>
                                        <p className="text-2xl font-bold text-primary">R$ 1,20</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button size="lg">Salvar Receita</Button>
                            </div>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="componentes" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">
                                Banco de Componentes (Cremes, Caldas, Bases)
                            </h3>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Novo Componente
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Componentes são preparos intermediários usados em várias receitas
                        </p>
                        <div className="space-y-2">
                            {["Ganache de Chocolate", "Calda de Morango", "Massa Pão de Ló"].map(
                                (comp, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                    >
                                        <span className="font-medium">{comp}</span>
                                        <Button variant="ghost" size="sm">
                                            Ver Detalhes
                                        </Button>
                                    </div>
                                )
                            )}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="calculo" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-primary" />
                            Painel de Cálculo de Preço
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Label>Selecionar Produto</Label>
                                <Input placeholder="Escolha uma receita..." />
                            </div>
                            <div>
                                <Label>Quantidade a Produzir</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-secondary p-6 rounded-lg space-y-4">
                                <h4 className="font-semibold text-lg border-b pb-2 border-border">
                                    Composição de Custos
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Ingredientes:</span>
                                        <span className="font-semibold">R$ 45,00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Mão de Obra:</span>
                                        <span className="font-semibold">R$ 15,00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Custo Fixo:</span>
                                        <span className="font-semibold">R$ 8,00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Embalagem:</span>
                                        <span className="font-semibold">R$ 5,00</span>
                                    </div>
                                </div>
                                <div className="border-t pt-4 border-border">
                                    <div className="flex justify-between text-lg">
                                        <span className="font-semibold">Custo Total:</span>
                                        <span className="font-bold text-foreground">R$ 73,00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary/5 p-6 rounded-lg border-2 border-primary/20">
                                <h4 className="font-semibold text-lg mb-4">Definir Margem de Lucro</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <Label>Margem Desejada (%)</Label>
                                        <Input type="number" placeholder="40" defaultValue="40" />
                                    </div>
                                    <div>
                                        <Label>Preço Sugerido</Label>
                                        <Input
                                            readOnly
                                            value="R$ 102,20"
                                            className="font-bold bg-background"
                                        />
                                    </div>
                                    <div>
                                        <Label>Lucro por Unidade</Label>
                                        <Input
                                            readOnly
                                            value="R$ 29,20"
                                            className="font-bold text-green-500 bg-background"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
