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
import { Factory, FileText, Plus } from "lucide-react";
import { format } from "date-fns";

const mockProduction = [
    {
        produto: "Bolo de Chocolate",
        quantidade: 15,
        lote: "L2025-001",
        validade: "2025-11-25",
        tempo: "120 min",
        quebra: "0.5 kg",
        observacao: "Produção normal",
    },
    {
        produto: "Brigadeiro Gourmet",
        quantidade: 200,
        lote: "L2025-002",
        validade: "2025-11-22",
        tempo: "90 min",
        quebra: "10 unid",
        observacao: "",
    },
];

export default function Producao() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Produção</h1>
                <p className="text-muted-foreground">
                    Registre e acompanhe a produção diária
                </p>
            </div>

            <Tabs defaultValue="registro" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="registro" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Registro
                    </TabsTrigger>
                    <TabsTrigger value="relatorios" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Relatórios
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="registro" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Factory className="h-5 w-5 text-primary" />
                            Novo Registro de Produção
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <Label>Produto</Label>
                                <Input placeholder="Nome do produto" />
                            </div>
                            <div>
                                <Label>Quantidade Produzida</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                            <div>
                                <Label>Lote</Label>
                                <Input placeholder="Ex: L2025-001" />
                            </div>
                            <div>
                                <Label>Validade</Label>
                                <Input type="date" />
                            </div>
                            <div>
                                <Label>Tempo Gasto (minutos)</Label>
                                <Input type="number" placeholder="0" />
                            </div>
                            <div>
                                <Label>Quebra/Desperdício</Label>
                                <Input placeholder="Ex: 0.5 kg" />
                            </div>
                            <div className="md:col-span-2">
                                <Label>Observações</Label>
                                <Textarea placeholder="Observações sobre a produção..." rows={3} />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button size="lg">Registrar Produção</Button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Produção de Hoje</h3>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Quantidade</TableHead>
                                        <TableHead>Lote</TableHead>
                                        <TableHead>Validade</TableHead>
                                        <TableHead>Tempo</TableHead>
                                        <TableHead>Quebra</TableHead>
                                        <TableHead>Observação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockProduction.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{item.produto}</TableCell>
                                            <TableCell>{item.quantidade}</TableCell>
                                            <TableCell>{item.lote}</TableCell>
                                            <TableCell>{format(new Date(item.validade), "dd/MM/yyyy")}</TableCell>
                                            <TableCell>{item.tempo}</TableCell>
                                            <TableCell>{item.quebra}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.observacao || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="relatorios" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Total Produzido Hoje</p>
                            <p className="text-3xl font-bold text-foreground">215</p>
                            <p className="text-xs text-muted-foreground mt-1">unidades</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Produtos Diferentes</p>
                            <p className="text-3xl font-bold text-foreground">8</p>
                            <p className="text-xs text-muted-foreground mt-1">variedades</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Tempo Total</p>
                            <p className="text-3xl font-bold text-foreground">210</p>
                            <p className="text-xs text-muted-foreground mt-1">minutos</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">Quebra</p>
                            <p className="text-3xl font-bold text-yellow-500">2.5%</p>
                            <p className="text-xs text-muted-foreground mt-1">do total</p>
                        </Card>
                    </div>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Produtos Mais Produzidos (Últimos 30 dias)
                        </h3>
                        <div className="space-y-3">
                            {[
                                { produto: "Brigadeiro Gourmet", quantidade: 1500, percentual: 28 },
                                { produto: "Bolo de Chocolate", quantidade: 450, percentual: 22 },
                                { produto: "Torta de Limão", quantidade: 320, percentual: 18 },
                                { produto: "Cheesecake", quantidade: 280, percentual: 15 },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium">{item.produto}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantidade} unidades
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-primary">{item.percentual}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Análise de Quebras/Desperdício
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                                <span className="font-medium">Custo Estimado de Perda (Mensal)</span>
                                <span className="font-bold text-destructive">R$ 485,00</span>
                            </div>
                            <div className="flex justify-between p-3 bg-secondary rounded-lg">
                                <span>Quebra Média Diária</span>
                                <span className="font-semibold">1.8%</span>
                            </div>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
