"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
import { CheckSquare, FileText, BarChart3, Download } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const checklistTypes = [
    "Diário",
    "Produção",
    "Recebimento",
    "Estoque",
    "Compra/Reposição",
];

const mockItems = [
    { id: 1, text: "Verificar temperatura do refrigerador", checked: true },
    { id: 2, text: "Limpar bancadas de trabalho", checked: true },
    { id: 3, text: "Verificar validade dos produtos", checked: false },
    { id: 4, text: "Organizar área de armazenamento", checked: false },
    { id: 5, text: "Higienizar utensílios", checked: false },
];

const mockHistory = [
    {
        data: "2025-11-18",
        tipo: "Diário",
        item: "Verificar temperatura",
        status: "Concluído",
        observacao: "Temperatura normal",
        responsavel: "Maria Silva",
    },
    {
        data: "2025-11-18",
        tipo: "Produção",
        item: "Limpar equipamentos",
        status: "Pendente",
        observacao: "",
        responsavel: "João Santos",
    },
    {
        data: "2025-11-17",
        tipo: "Recebimento",
        item: "Conferir matéria-prima",
        status: "Concluído",
        observacao: "Todos itens OK",
        responsavel: "Maria Silva",
    },
];

export default function Checklists() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedType, setSelectedType] = useState<string>("");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Checklists</h1>
                <p className="text-muted-foreground">
                    Gerencie e acompanhe os checklists operacionais
                </p>
            </div>

            <Tabs defaultValue="preencher" className="w-full">
                <TabsList className="grid w-full grid-cols-3 max-w-2xl">
                    <TabsTrigger value="preencher" className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Preencher
                    </TabsTrigger>
                    <TabsTrigger value="historico" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Histórico
                    </TabsTrigger>
                    <TabsTrigger value="relatorio" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Relatório
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="preencher" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="p-6">
                            <Label className="mb-2 block">Tipo de Checklist</Label>
                            <Select value={selectedType} onValueChange={(val) => setSelectedType(val ?? "")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {checklistTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Card>

                        <Card className="p-6 lg:col-span-2">
                            <Label className="mb-2 block">Data</Label>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                locale={ptBR}
                                className="rounded-md border w-fit pointer-events-auto"
                            />
                        </Card>
                    </div>

                    {selectedType && (
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">
                                Checklist: {selectedType}
                            </h3>
                            <div className="space-y-4">
                                {mockItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start gap-4 p-4 bg-secondary rounded-lg"
                                    >
                                        <Switch defaultChecked={item.checked} />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.text}</p>
                                            <Textarea
                                                placeholder="Observações (opcional)"
                                                className="mt-2"
                                                rows={2}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end mt-6">
                                <Button size="lg">Salvar Checklist</Button>
                            </div>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="historico" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Base de Dados</h3>
                            <Button variant="outline" className="gap-2">
                                <Download className="h-4 w-4" />
                                Exportar
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <Label>Filtrar por Tipo</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        {checklistTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Filtrar por Status</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos</SelectItem>
                                        <SelectItem value="concluido">Concluído</SelectItem>
                                        <SelectItem value="pendente">Pendente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label>Buscar</Label>
                                <Input placeholder="Buscar..." />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Observação</TableHead>
                                        <TableHead>Responsável</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockHistory.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{format(new Date(item.data), "dd/MM/yyyy")}</TableCell>
                                            <TableCell>{item.tipo}</TableCell>
                                            <TableCell>{item.item}</TableCell>
                                            <TableCell>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === "Concluído"
                                                        ? "bg-green-500/10 text-green-500"
                                                        : "bg-yellow-500/10 text-yellow-500"
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.observacao || "-"}
                                            </TableCell>
                                            <TableCell>{item.responsavel}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="relatorio" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                Conformidade Mensal
                            </p>
                            <p className="text-4xl font-bold text-green-500">87%</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                Checklists Completos
                            </p>
                            <p className="text-4xl font-bold text-foreground">156</p>
                        </Card>
                        <Card className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-2">
                                Itens Pendentes
                            </p>
                            <p className="text-4xl font-bold text-yellow-500">23</p>
                        </Card>
                    </div>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Itens Mais Esquecidos
                        </h3>
                        <div className="space-y-3">
                            {[
                                { item: "Verificar validade dos produtos", falhas: 12 },
                                { item: "Limpar área de armazenamento", falhas: 8 },
                                { item: "Registrar temperatura", falhas: 6 },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                >
                                    <span className="font-medium">{item.item}</span>
                                    <span className="text-destructive font-semibold">
                                        {item.falhas} falhas
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="flex justify-end">
                        <Button size="lg" className="gap-2">
                            <Download className="h-4 w-4" />
                            Imprimir Relatório para Vigilância
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
