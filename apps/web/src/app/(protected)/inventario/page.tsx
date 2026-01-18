"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Package, Plus, Filter, Upload } from "lucide-react";
import { format } from "date-fns";

const mockInventory = [
    {
        nome: "Batedeira Industrial",
        categoria: "Equipamentos",
        dataCompra: "2024-01-15",
        numeroSerie: "BAT-2024-001",
        valor: 2500.0,
        garantia: "2026-01-15",
        local: "Cozinha Principal",
        estado: "Ótimo",
    },
    {
        nome: "Forno Elétrico",
        categoria: "Equipamentos",
        dataCompra: "2023-06-20",
        numeroSerie: "FOR-2023-012",
        valor: 4200.0,
        garantia: "2025-06-20",
        local: "Cozinha Principal",
        estado: "Bom",
    },
    {
        nome: "Mesa Inox",
        categoria: "Móveis",
        dataCompra: "2024-03-10",
        numeroSerie: "MES-2024-003",
        valor: 850.0,
        garantia: "-",
        local: "Cozinha Principal",
        estado: "Ótimo",
    },
    {
        nome: "Freezer Horizontal",
        categoria: "Equipamentos",
        dataCompra: "2023-11-05",
        numeroSerie: "FRE-2023-008",
        valor: 3200.0,
        garantia: "2025-11-05",
        local: "Área de Armazenamento",
        estado: "Bom",
    },
];

export default function Inventario() {
    const totalValue = mockInventory.reduce((sum, item) => sum + item.valor, 0);

    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case "Ótimo":
                return <Badge className="bg-green-500 hover:bg-green-600 text-white">Ótimo</Badge>;
            case "Bom":
                return <Badge variant="secondary">Bom</Badge>;
            case "Regular":
                return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Regular</Badge>;
            case "Ruim":
                return <Badge variant="destructive">Ruim</Badge>;
            default:
                return <Badge variant="secondary">{estado}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Inventário
                    </h1>
                    <p className="text-muted-foreground">
                        Móveis, equipamentos e utensílios
                    </p>
                </div>
                <Button size="lg" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Item
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 text-center border-l-4 border-l-primary">
                    <p className="text-sm text-muted-foreground mb-2">Total de Itens</p>
                    <p className="text-3xl font-bold text-foreground">{mockInventory.length}</p>
                </Card>
                <Card className="p-6 text-center border-l-4 border-l-green-500">
                    <p className="text-sm text-muted-foreground mb-2">Valor Total</p>
                    <p className="text-3xl font-bold text-green-500">
                        R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                </Card>
                <Card className="p-6 text-center border-l-4 border-l-yellow-500">
                    <p className="text-sm text-muted-foreground mb-2">Em Garantia</p>
                    <p className="text-3xl font-bold text-yellow-500">3</p>
                </Card>
                <Card className="p-6 text-center border-l-4 border-l-accent">
                    <p className="text-sm text-muted-foreground mb-2">Categorias</p>
                    <p className="text-3xl font-bold text-foreground">5</p>
                </Card>
            </div>

            <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Itens do Inventário
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
                                <SelectItem value="equipamentos">Equipamentos</SelectItem>
                                <SelectItem value="moveis">Móveis</SelectItem>
                                <SelectItem value="utensilios">Utensílios</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Estado</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="otimo">Ótimo</SelectItem>
                                <SelectItem value="bom">Bom</SelectItem>
                                <SelectItem value="regular">Regular</SelectItem>
                                <SelectItem value="ruim">Ruim</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Buscar</Label>
                        <Input placeholder="Nome do item..." />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Categoria</TableHead>
                                <TableHead>Data Compra</TableHead>
                                <TableHead>N° Série</TableHead>
                                <TableHead>Valor</TableHead>
                                <TableHead>Garantia</TableHead>
                                <TableHead>Local</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockInventory.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{item.nome}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.categoria}
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(item.dataCompra), "dd/MM/yyyy")}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">
                                        {item.numeroSerie}
                                    </TableCell>
                                    <TableCell className="font-semibold">
                                        R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    </TableCell>
                                    <TableCell>
                                        {item.garantia !== "-"
                                            ? format(new Date(item.garantia), "dd/MM/yyyy")
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {item.local}
                                    </TableCell>
                                    <TableCell>{getEstadoBadge(item.estado)}</TableCell>
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
                <h3 className="text-lg font-semibold mb-4">Adicionar Novo Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Nome do Item</Label>
                        <Input placeholder="Ex: Batedeira Industrial" />
                    </div>
                    <div>
                        <Label>Categoria</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="equipamentos">Equipamentos</SelectItem>
                                <SelectItem value="moveis">Móveis</SelectItem>
                                <SelectItem value="utensilios">Utensílios</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Data de Compra</Label>
                        <Input type="date" />
                    </div>
                    <div>
                        <Label>Número de Série</Label>
                        <Input placeholder="Ex: BAT-2024-001" />
                    </div>
                    <div>
                        <Label>Valor (R$)</Label>
                        <Input type="number" step="0.01" placeholder="0,00" />
                    </div>
                    <div>
                        <Label>Garantia até</Label>
                        <Input type="date" />
                    </div>
                    <div>
                        <Label>Local de Armazenamento</Label>
                        <Input placeholder="Ex: Cozinha Principal" />
                    </div>
                    <div>
                        <Label>Estado de Conservação</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="otimo">Ótimo</SelectItem>
                                <SelectItem value="bom">Bom</SelectItem>
                                <SelectItem value="regular">Regular</SelectItem>
                                <SelectItem value="ruim">Ruim</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2">
                        <Label>Upload de Foto</Label>
                        <div className="mt-2 flex items-center gap-2">
                            <Input type="file" accept="image/*" />
                            <Button variant="outline" size="icon">
                                <Upload className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <Button size="lg">Adicionar ao Inventário</Button>
                </div>
            </Card>
        </div>
    );
}
