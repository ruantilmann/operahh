"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const mockPackaging = [
  {
    produto: "Caixa Kraft 20x20",
    categoria: "Caixas",
    quantidade: "80 unid",
    dataEntrada: "2025-11-05",
    validade: "2027-01-10",
    local: "Depósito A",
    status: "normal",
  },
  {
    produto: "Pote 250ml",
    categoria: "Potes",
    quantidade: "40 unid",
    dataEntrada: "2025-11-20",
    validade: "2026-04-15",
    local: "Prateleira C1",
    status: "baixo",
  },
  {
    produto: "Saco Transparente",
    categoria: "Sacos e Sacolas",
    quantidade: "200 unid",
    dataEntrada: "2025-10-15",
    validade: "2026-10-15",
    local: "Prateleira C2",
    status: "normal",
  },
  {
    produto: "Etiqueta Térmica",
    categoria: "Etiquetas",
    quantidade: "12 rolos",
    dataEntrada: "2025-11-12",
    validade: "2026-02-28",
    local: "Gaveta 3",
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
      return (
        <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">
          Estoque Baixo
        </Badge>
      );
    }
    return <Badge variant="secondary">Normal</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Estoque de Matéria-Prima
        </h1>
        <p className="text-muted-foreground">
          Controle de ingredientes e materiais
        </p>
      </div>
      <Tabs defaultValue="ingredientes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="ingredientes">Ingredientes</TabsTrigger>
          <TabsTrigger value="embalagens">Embalagens</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredientes" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center border-l-4 border-l-primary">
              <p className="text-sm text-muted-foreground mb-2">
                Total de Itens
              </p>
              <p className="text-3xl font-bold text-foreground">142</p>
            </Card>
            <Card className="p-6 text-center border-l-4 border-l-yellow-500">
              <p className="text-sm text-muted-foreground mb-2">
                Estoque Baixo
              </p>
              <p className="text-3xl font-bold text-yellow-500">8</p>
            </Card>
            <Card className="p-6 text-center border-l-4 border-l-destructive">
              <p className="text-sm text-muted-foreground mb-2">
                Vencendo (7 dias)
              </p>
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
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Produto
                </Button>
              </div>
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
                      <TableCell className="font-medium">
                        {item.produto}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.categoria}
                      </TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>
                        {format(new Date(item.dataEntrada), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.validade), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.local}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(item.status, item.validade)}
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
        </TabsContent>

        <TabsContent value="embalagens" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center border-l-4 border-l-primary">
              <p className="text-sm text-muted-foreground mb-2">Total de Itens</p>
              <p className="text-3xl font-bold text-foreground">64</p>
            </Card>
            <Card className="p-6 text-center border-l-4 border-l-yellow-500">
              <p className="text-sm text-muted-foreground mb-2">Estoque Baixo</p>
              <p className="text-3xl font-bold text-yellow-500">5</p>
            </Card>
            <Card className="p-6 text-center border-l-4 border-l-destructive">
              <p className="text-sm text-muted-foreground mb-2">Vencendo (7 dias)</p>
              <p className="text-3xl font-bold text-destructive">2</p>
            </Card>
            <Card className="p-6 text-center border-l-4 border-l-green-500">
              <p className="text-sm text-muted-foreground mb-2">Em Dia</p>
              <p className="text-3xl font-bold text-green-500">57</p>
            </Card>
          </div>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Archive className="h-5 w-5 text-primary" />
                Embalagens em Estoque
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                </Button>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Adicionar Embalagem
                </Button>
              </div>
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
                    <SelectItem value="caixas">Caixas</SelectItem>
                    <SelectItem value="potes">Potes</SelectItem>
                    <SelectItem value="sacos">Sacos e Sacolas</SelectItem>
                    <SelectItem value="etiquetas">Etiquetas</SelectItem>
                    <SelectItem value="filmes">Filmes e Lacres</SelectItem>
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
                <Input placeholder="Nome da embalagem..." />
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Embalagem</TableHead>
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
                  {mockPackaging.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.produto}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.categoria}
                      </TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>
                        {format(new Date(item.dataEntrada), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.validade), "dd/MM/yyyy")}
                      </TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
