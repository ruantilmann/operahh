"use client";

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Plus, MoreHorizontal, Edit, Copy } from "lucide-react";

export default function BaseDeDadosPage() {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [products, setProducts] = useState([
    { id: 1, name: "Bolo de Chocolate", price: 45.00, category: "Bolos" },
    { id: 2, name: "Brigadeiro Gourmet", price: 3.50, category: "Doces" },
    { id: 3, name: "Torta de Limão", price: 38.00, category: "Tortas" },
  ]);

  const handleAddProduct = (formData: FormData) => {
    const newProduct = {
      id: products.length + 1,
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      category: formData.get("category") as string,
    };
    setProducts([...products, newProduct]);
    setIsProductDialogOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const handleDuplicateProduct = (product: { id: number; name: string; price: number; category: string }) => {
    const duplicatedProduct = {
      id: products.length + 1,
      name: `${product.name} (Cópia)`,
      price: product.price,
      category: product.category,
    };
    setProducts([...products, duplicatedProduct]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Base de Dados</h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe os dados financeiros e receitas
        </p>
      </div>

      <Tabs defaultValue="financeiro" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-lg">
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
        </TabsList>

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

        <TabsContent value="receitas" className="space-y-6 mt-6">
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

        <TabsContent value="produtos" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Gestão de Produtos</h3>
                <p className="text-sm text-muted-foreground">
                  Cadastre e gerencie os produtos da sua confeitaria
                </p>
              </div>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger render={
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Novo Produto
                  </Button>
                } />
                <DialogContent className="sm:max-w-[425px]">
                  <form action={handleAddProduct}>
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Produto</DialogTitle>
                      <DialogDescription>
                        Preencha as informações do novo produto para cadastrá-lo no sistema.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome do Produto</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="Ex: Bolo de Chocolate"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="price">Preço (R$)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category">Categoria</Label>
                        <Input
                          id="category"
                          name="category"
                          placeholder="Ex: Bolos, Doces, Tortas"
                          required
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Salvar Produto</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Nenhum produto cadastrado ainda.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        } />
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateProduct(product)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive" 
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}