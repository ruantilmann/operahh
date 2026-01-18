"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Archive, AlertTriangle, Plus, Filter } from "lucide-react";
import { format, differenceInDays } from "date-fns";

const mockStock = [
    {
        produto: "Chocolate em Pó",
        categoria: "Ingredientes Secos",
        quantidade: "5 kg",
        dataEntrada: "2025-11-10",
        validade: "2026-05-10",
        local: "Prateleira A1",
        status: "normal",
    },
    {
        produto: "Leite Condensado",
        categoria: "Laticínios",
        quantidade: "12 latas",
        dataEntrada: "2025-11-15",
        validade: "2025-11-25",
        local: "Refrigerador 2",
        status: "vencendo",
    },
    {
        produto: "Farinha de Trigo",
        categoria: "Ingredientes Secos",
        quantidade: "2 kg",
        dataEntrada: "2025-11-01",
        validade: "2026-11-01",
        local: "Prateleira B2",
        status: "baixo",
    },
    {
        produto: "Manteiga",
        categoria: "Laticínios",
        quantidade: "15 unid",
        dataEntrada: "2025-11-18",
        validade: "2025-12-15",
        local: "Refrigerador 1",
        status: "normal",
    },
];

export default function Estoque() {
    const getStatusBadge = (status: string, validade: string) => {
        const daysUntilExpiry = differenceInDays(new Date(validade), new Date());

        if (daysUntilExpiry <= 3) {
            return (
                <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Vence em {daysUntilExpiry}d
                </Badge>
            );
        }
        if (status === "baixo") {
            return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Estoque Baixo</Badge>;
        }
        return <Badge variant="secondary">Normal</Badge>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Estoque de Matéria-Prima
                    </h1>
                    <p className="text-muted-foreground">
                        Controle de ingredientes e materiais
                    </p>
                </div>
                <Button size="lg" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Produto
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-6 text-center border-l-4 border-l-primary">
                    <p className="text-sm text-muted-foreground mb-2">Total de Itens</p>
                    <p className="text-3xl font-bold text-foreground">142</p>
                </Card>
                <Card className="p-6 text-center border-l-4 border-l-yellow-500">
                    <p className="text-sm text-muted-foreground mb-2">Estoque Baixo</p>
                    <p className="text-3xl font-bold text-yellow-500">8</p>
                </Card>
                <Card className="p-6 text-center border-l-4 border-l-destructive">
                    <p className="text-sm text-muted-foreground mb-2">Vencendo (7 dias)</p>
                    <p className="text-3xl font-bold text-destructive">3</p>
                </Card>
                <Card className="p-6 text-center border-l-4 border-l-green-500">
                    <p className="text-sm text-muted-foreground mb-2">Em Dia</p>
                    <p className="text-3xl font-bold text-green-500">131</p>
                </Card>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Archive className="h-5 w-5 text-primary" />
                        Produtos em Estoque
                    </h3>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filtros
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <Label>Categoria</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Todas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas</SelectItem>
                                <SelectItem value="secos">Ingredientes Secos</SelectItem>
                                <SelectItem value="laticinios">Laticínios</SelectItem>
                                <SelectItem value="frutas">Frutas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Status</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="baixo">Estoque Baixo</SelectItem>
                                <SelectItem value="vencendo">Vencendo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Buscar</Label>
                        <Input placeholder="Nome do produto..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Quantidade</TableHead>
                                <TableHead>Data Entrada</TableHead>
                                <TableHead>Validade</TableHead>
                                <TableHead>Local</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockStock.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.produto}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.categoria}
                                    </TableCell>
                                    <TableCell>{item.quantidade}</TableCell>
                                    <TableCell>
                                        {format(new Date(item.dataEntrada), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell>{format(new Date(item.validade), "dd/MM/yyyy")}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.local}</TableCell>
                                    <TableCell>{getStatusBadge(item.status, item.validade)}</TableCell>
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
        </div>
    );
}
