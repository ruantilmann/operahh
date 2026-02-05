"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { Wallet, ArrowUpRight, ArrowDownRight, Plus } from "lucide-react";
import { format } from "date-fns";

const mockEntries = [
    { data: "2025-11-18", total: 3245.0, observacao: "Vendas do dia" },
    { data: "2025-11-17", total: 2150.0, observacao: "" },
];

const mockExits = [
    {
        data: "2025-11-18",
        categoria: "Matéria-prima",
        descricao: "Compra de chocolate",
        valor: 450.0,
        formaPagamento: "Cartão",
        responsavel: "Maria Silva",
    },
    {
        data: "2025-11-18",
        categoria: "Energia",
        descricao: "Conta de luz",
        valor: 280.0,
        formaPagamento: "Débito",
        responsavel: "João Santos",
    },
];

const paymentLabels: Record<string, string> = {
    dinheiro: "Dinheiro",
    cartao: "Cartão",
    debito: "Débito",
    pix: "PIX",
    boleto: "Boleto",
};

const exitCategoryLabels: Record<string, string> = {
    materia: "Matéria-prima",
    energia: "Energia",
    agua: "Água",
    gas: "Gás",
    aluguel: "Aluguel",
    outros: "Outros",
};

export default function Caixa() {
    const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
    const [isExitModalOpen, setIsExitModalOpen] = useState(false);
    const totalEntries = mockEntries.reduce((sum, entry) => sum + entry.total, 0);
    const totalExits = mockExits.reduce((sum, exit) => sum + exit.valor, 0);
    const balance = totalEntries - totalExits;
    const today = new Date().toISOString().slice(0, 10);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Caixa - Entradas e Saídas
                </h1>
                <p className="text-muted-foreground">
                    Controle completo do fluxo de caixa
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-l-4 border-l-green-500">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Total Entradas</p>
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-green-500">
                        R$ {totalEntries.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                </Card>

                <Card className="p-6 border-l-4 border-l-destructive">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Total Saídas</p>
                        <ArrowDownRight className="h-5 w-5 text-destructive" />
                    </div>
                    <p className="text-3xl font-bold text-destructive">
                        R$ {totalExits.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                </Card>

                <Card className="p-6 border-l-4 border-l-primary">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-muted-foreground">Saldo</p>
                        <Wallet className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-primary">
                        R$ {balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                </Card>
            </div>

            <Tabs defaultValue="entradas" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="entradas" className="flex items-center gap-2">
                        <ArrowUpRight className="h-4 w-4" />
                        Entradas
                    </TabsTrigger>
                    <TabsTrigger value="saidas" className="flex items-center gap-2">
                        <ArrowDownRight className="h-4 w-4" />
                        Saídas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="entradas" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Histórico de Entradas</h3>
                            <Dialog open={isEntryModalOpen} onOpenChange={setIsEntryModalOpen}>
                                <DialogTrigger
                                    render={
                                        <Button className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Registrar Entrada
                                        </Button>
                                    }
                                />
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Plus className="h-5 w-5 text-green-500" />
                                            Registrar Entrada
                                        </DialogTitle>
                                    </DialogHeader>
                                    <Tabs defaultValue="instadelivery" className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="instadelivery">InstaDelivery</TabsTrigger>
                                            <TabsTrigger value="ifood">Ifood</TabsTrigger>
                                            <TabsTrigger value="manual">Manual</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="instadelivery" className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Data</Label>
                                                    <Input type="date" defaultValue={today} />
                                                </div>
                                                <div>
                                                    <Label>Nome do Cliente</Label>
                                                    <Input placeholder="Nome completo" />
                                                </div>
                                                <div>
                                                    <Label>WhatsApp</Label>
                                                    <Input placeholder="(00) 00000-0000" />
                                                </div>
                                                <div>
                                                    <Label>Entrega/Retirada</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="entrega">Entrega</SelectItem>
                                                            <SelectItem value="retirada">Retirada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Taxa de Entrega</Label>
                                                    <Input type="number" step="0.01" placeholder="R$ 0,00" />
                                                </div>
                                                <div>
                                                    <Label>Forma de Pagamento</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione">
                                                                {(value) => paymentLabels[String(value)] ?? "Selecione"}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                            <SelectItem value="cartao">Cartão</SelectItem>
                                                            <SelectItem value="debito">Débito</SelectItem>
                                                            <SelectItem value="pix">PIX</SelectItem>
                                                            <SelectItem value="boleto">Boleto</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Valor Pago</Label>
                                                    <Input type="number" step="0.01" placeholder="R$ 0,00" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Itens do Pedido</Label>
                                                    <Textarea placeholder="Ex: 2x Brigadeiro (R$ 5,00), 1x Coxinha (R$ 7,00)" rows={3} />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Observacao</Label>
                                                    <Textarea placeholder="Observacao adicional" rows={2} />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button size="lg" className="gap-2" onClick={() => setIsEntryModalOpen(false)}>
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    Salvar
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="ifood" className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Data</Label>
                                                    <Input type="date" defaultValue={today} />
                                                </div>
                                                <div>
                                                    <Label>Nome do Cliente</Label>
                                                    <Input placeholder="Nome completo" />
                                                </div>
                                                <div>
                                                    <Label>WhatsApp</Label>
                                                    <Input placeholder="(00) 00000-0000" />
                                                </div>
                                                <div>
                                                    <Label>Entrega/Retirada</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="entrega">Entrega</SelectItem>
                                                            <SelectItem value="retirada">Retirada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Taxa de Entrega</Label>
                                                    <Input type="number" step="0.01" placeholder="R$ 0,00" />
                                                </div>
                                                <div>
                                                    <Label>Forma de Pagamento</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione">
                                                                {(value) => paymentLabels[String(value)] ?? "Selecione"}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                            <SelectItem value="cartao">Cartão</SelectItem>
                                                            <SelectItem value="debito">Débito</SelectItem>
                                                            <SelectItem value="pix">PIX</SelectItem>
                                                            <SelectItem value="boleto">Boleto</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Valor Pago</Label>
                                                    <Input type="number" step="0.01" placeholder="R$ 0,00" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Itens do Pedido</Label>
                                                    <Textarea placeholder="Ex: 2x Brigadeiro (R$ 5,00), 1x Coxinha (R$ 7,00)" rows={3} />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Observacao</Label>
                                                    <Textarea placeholder="Observacao adicional" rows={2} />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button size="lg" className="gap-2" onClick={() => setIsEntryModalOpen(false)}>
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    Salvar
                                                </Button>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="manual" className="space-y-4 mt-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Data</Label>
                                                    <Input type="date" defaultValue={today} />
                                                </div>
                                                <div>
                                                    <Label>Nome do Cliente</Label>
                                                    <Input placeholder="Nome completo" />
                                                </div>
                                                <div>
                                                    <Label>WhatsApp</Label>
                                                    <Input placeholder="(00) 00000-0000" />
                                                </div>
                                                <div>
                                                    <Label>Entrega/Retirada</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="entrega">Entrega</SelectItem>
                                                            <SelectItem value="retirada">Retirada</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Taxa de Entrega</Label>
                                                    <Input type="number" step="0.01" placeholder="R$ 0,00" />
                                                </div>
                                                <div>
                                                    <Label>Forma de Pagamento</Label>
                                                    <Select>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecione">
                                                                {(value) => paymentLabels[String(value)] ?? "Selecione"}
                                                            </SelectValue>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                            <SelectItem value="cartao">Cartão</SelectItem>
                                                            <SelectItem value="debito">Débito</SelectItem>
                                                            <SelectItem value="pix">PIX</SelectItem>
                                                            <SelectItem value="boleto">Boleto</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label>Valor Pago</Label>
                                                    <Input type="number" step="0.01" placeholder="R$ 0,00" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Itens do Pedido</Label>
                                                    <Textarea placeholder="Ex: 2x Brigadeiro (R$ 5,00), 1x Coxinha (R$ 7,00)" rows={3} />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <Label>Observacao</Label>
                                                    <Textarea placeholder="Observacao adicional" rows={2} />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <Button size="lg" className="gap-2" onClick={() => setIsEntryModalOpen(false)}>
                                                    <ArrowUpRight className="h-4 w-4" />
                                                    Salvar
                                                </Button>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Observação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockEntries.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{format(new Date(item.data), "dd/MM/yyyy")}</TableCell>
                                            <TableCell className="font-bold text-green-500">
                                                R$ {item.total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </TableCell>
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

                <TabsContent value="saidas" className="space-y-6 mt-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Histórico de Saídas</h3>
                            <Dialog open={isExitModalOpen} onOpenChange={setIsExitModalOpen}>
                                <DialogTrigger
                                    render={
                                        <Button variant="destructive" className="gap-2">
                                            <Plus className="h-4 w-4" />
                                            Registrar Saída
                                        </Button>
                                    }
                                />
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center gap-2">
                                            <Plus className="h-5 w-5 text-destructive" />
                                            Registrar Saída
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <Label>Data</Label>
                                            <Input type="date" />
                                        </div>
                                        <div>
                                            <Label>Categoria</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione">
                                                        {(value) => exitCategoryLabels[String(value)] ?? "Selecione"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="materia">Matéria-prima</SelectItem>
                                                    <SelectItem value="energia">Energia</SelectItem>
                                                    <SelectItem value="agua">Água</SelectItem>
                                                    <SelectItem value="gas">Gás</SelectItem>
                                                    <SelectItem value="aluguel">Aluguel</SelectItem>
                                                    <SelectItem value="outros">Outros</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Descrição</Label>
                                            <Input placeholder="Descrição da despesa" />
                                        </div>
                                        <div>
                                            <Label>Valor</Label>
                                            <Input type="number" step="0.01" placeholder="R$ 0,00" />
                                        </div>
                                        <div>
                                            <Label>Forma de Pagamento</Label>
                                            <Select>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione">
                                                        {(value) => paymentLabels[String(value)] ?? "Selecione"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                                    <SelectItem value="cartao">Cartão</SelectItem>
                                                    <SelectItem value="debito">Débito</SelectItem>
                                                    <SelectItem value="pix">PIX</SelectItem>
                                                    <SelectItem value="boleto">Boleto</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <Label>Responsável</Label>
                                            <Input placeholder="Nome do responsável" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button size="lg" variant="destructive" className="gap-2" onClick={() => setIsExitModalOpen(false)}>
                                            <ArrowDownRight className="h-4 w-4" />
                                            Registrar Saída
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Categoria</TableHead>
                                        <TableHead>Descrição</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Pagamento</TableHead>
                                        <TableHead>Responsável</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockExits.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{format(new Date(item.data), "dd/MM/yyyy")}</TableCell>
                                            <TableCell>{item.categoria}</TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {item.descricao}
                                            </TableCell>
                                            <TableCell className="font-bold text-destructive">
                                                R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell>{item.formaPagamento}</TableCell>
                                            <TableCell>{item.responsavel}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
