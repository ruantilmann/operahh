"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TrendingUp, Calculator, PieChart, DollarSign } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const mockRevenue = [
    {
        data: "2025-11-18",
        total: 3245.0,
        observacao: "Sábado movimentado",
    },
    {
        data: "2025-11-17",
        total: 2150.0,
        observacao: "",
    },
];

const productRevenue = [
    {
        produto: "Brigadeiro Gourmet",
        quantidade: 150,
        custoFixo: 45.0,
        maoObra: 30.0,
        custoVariavel: 180.0,
        lucro: 85.0,
    },
    {
        produto: "Bolo de Chocolate",
        quantidade: 8,
        custoFixo: 68.0,
        maoObra: 102.0,
        custoVariavel: 544.0,
        lucro: 246.0,
    },
];

const distributionData = [
    { name: "Mão de Obra", value: 28, color: "hsl(var(--primary))" },
    { name: "Custo Fixo", value: 22, color: "hsl(var(--accent))" },
    { name: "Matéria-Prima", value: 35, color: "hsl(var(--destructive))" }, // Adjusted color mapping to standard theme
    { name: "Lucro", value: 15, color: "hsl(var(--ring))" }, // Adjusted color
];

export default function Faturamento() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Faturamento</h1>
                <p className="text-muted-foreground">
                    Registre e analise o faturamento diário
                </p>
            </div>

            <Tabs defaultValue="registro" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-2xl">
                    <TabsTrigger value="registro" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Registro
                    </TabsTrigger>
                    <TabsTrigger value="calculo" className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Cálculo por Produto
                    </TabsTrigger>
                    <TabsTrigger value="distribuicao" className="flex items-center gap-2">
                        <PieChart className="h-4 w-4" />
                        Distribuição
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="registro" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Registro de Faturamento Diário
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label>Data</Label>
                                <Input type="date" />
                            </div>
                            <div>
                                <Label>Valor Total do Dia</Label>
                                <Input type="number" step="0.01" placeholder="R$ 0,00" />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Observações</Label>
                                <Textarea placeholder="Observações sobre o dia..." rows={3} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button size="lg">Enviar para Cálculo Automático</Button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Histórico de Faturamento</h3>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Valor Total</TableHead>
                                        <TableHead>Observação</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockRevenue.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{new Date(item.data).toLocaleDateString("pt-BR")}</TableCell>
                                            <TableCell className="font-bold text-green-500">
                                                R$ {item.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.observacao || "-"}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    Detalhes
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="calculo" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Cálculo Automático por Produto
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Visualização dos custos e lucros detalhados por produto. Estes valores
                            são calculados automaticamente com base nos registros de produção e
                            faturamento.
                        </p>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Custo Fixo</TableHead>
                                        <TableHead>Mão de Obra</TableHead>
                                        <TableHead>Custo Variável</TableHead>
                                        <TableHead className="text-right">Lucro Final</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productRevenue.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.produto}</TableCell>
                                            <TableCell>{item.quantidade}</TableCell>
                                            <TableCell>
                                                R$ {item.custoFixo.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell>
                                                R$ {item.maoObra.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell>
                                                R$ {item.custoVariavel.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-green-500">
                                                R$ {item.lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Custo Total</p>
                            <p className="text-2xl font-bold text-foreground">R$ 969,00</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Faturamento</p>
                            <p className="text-2xl font-bold text-primary">R$ 1.300,00</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Lucro Líquido</p>
                            <p className="text-2xl font-bold text-green-500">R$ 331,00</p>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="distribuicao" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Controle de Faturamento - Distribuição
                        </h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPie>
                                        <Pie
                                            data={distributionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name} ${entry.value}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {distributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </RechartsPie>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-semibold mb-4">Detalhamento Percentual</h4>
                                {distributionData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-4 w-4 rounded"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="font-medium">{item.name}</span>
                                        </div>
                                        <span className="font-bold text-lg">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-primary/5 border-primary/20">
                        <h3 className="text-lg font-semibold mb-4">Resumo Financeiro do Período</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Total Faturado</p>
                                <p className="text-3xl font-bold text-foreground">R$ 42.850,00</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground mb-1">Lucro Acumulado</p>
                                <p className="text-3xl font-bold text-green-500">R$ 6.427,50</p>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
