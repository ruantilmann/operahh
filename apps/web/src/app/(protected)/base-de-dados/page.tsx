"use client";

import { useState, type FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { client, orpc } from "@/utils/orpc";
import { toast } from "sonner";

export default function BaseDeDadosPage() {
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    categoryId: "",
  });
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: "PRODUCT",
  });
  const queryClient = useQueryClient();

  const { data: productCategories, isLoading: isLoadingProductCategories } = useQuery(
    orpc.categories.list.queryOptions({ input: { type: "PRODUCT" } })
  );
  const { data: stockCategories, isLoading: isLoadingStockCategories } = useQuery(
    orpc.categories.list.queryOptions({ input: { type: "STOCK" } })
  );
  const { data: products, isLoading: isLoadingProducts } = useQuery(
    orpc.products.list.queryOptions({})
  );

  const createProductMutation = useMutation({
    mutationFn: async (data: { name: string; price: number; categoryId: string }) => {
      return await client.products.create(data);
    },
    onSuccess: () => {
      toast.success("Produto cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: orpc.products.list.queryKey() });
      setIsProductDialogOpen(false);
      setProductForm({ name: "", price: "", categoryId: "" });
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar produto: " + error.message);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      return await client.products.delete({ id });
    },
    onSuccess: () => {
      toast.success("Produto removido com sucesso!");
      queryClient.invalidateQueries({ queryKey: orpc.products.list.queryKey() });
    },
    onError: (error) => {
      toast.error("Erro ao remover produto: " + error.message);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return await client.categories.delete({ id });
    },
    onSuccess: () => {
      toast.success("Categoria removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: orpc.categories.list.queryKey({ input: { type: "PRODUCT" } }) });
      queryClient.invalidateQueries({ queryKey: orpc.categories.list.queryKey({ input: { type: "STOCK" } }) });
      queryClient.invalidateQueries({ queryKey: orpc.products.list.queryKey() });
    },
    onError: (error) => {
      toast.error("Erro ao remover categoria: " + error.message);
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; type: "PRODUCT" | "STOCK" }) => {
      return await client.categories.create(data);
    },
    onSuccess: () => {
      toast.success("Categoria cadastrada com sucesso!");
      queryClient.invalidateQueries({ queryKey: orpc.categories.list.queryKey({ input: { type: "PRODUCT" } }) });
      queryClient.invalidateQueries({ queryKey: orpc.categories.list.queryKey({ input: { type: "STOCK" } }) });
      setIsCategoryDialogOpen(false);
      setCategoryForm({ name: "", type: "PRODUCT" });
    },
    onError: (error) => {
      toast.error("Erro ao cadastrar categoria: " + error.message);
    },
  });

  const productsList = products ?? [];
  const hasProductCategories = (productCategories?.length ?? 0) > 0;
  const canSubmitProduct =
    Boolean(productForm.name.trim()) &&
    Boolean(productForm.price) &&
    Boolean(productForm.categoryId) &&
    !createProductMutation.isPending;
  const canSubmitCategory = Boolean(categoryForm.name.trim()) && !createCategoryMutation.isPending;

  const handleAddProduct = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const price = Number(productForm.price);
    if (!productForm.name.trim() || Number.isNaN(price) || price <= 0) {
      toast.error("Preencha os dados do produto corretamente");
      return;
    }

    if (!productForm.categoryId) {
      toast.error("Selecione uma categoria de produto");
      return;
    }

    createProductMutation.mutate({
      name: productForm.name.trim(),
      price,
      categoryId: productForm.categoryId,
    });
  };

  const handleAddCategory = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryForm.name.trim()) {
      toast.error("Informe o nome da categoria");
      return;
    }

    createCategoryMutation.mutate({
      name: categoryForm.name.trim(),
      type: categoryForm.type as "PRODUCT" | "STOCK",
    });
  };

  const handleDeleteProduct = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  const handleDuplicateProduct = (product: { id: string; name: string; price: number; categoryId: string }) => {
    createProductMutation.mutate({
      name: `${product.name} (Copia)`,
      price: product.price,
      categoryId: product.categoryId,
    });
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
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
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

        </TabsContent>

        <TabsContent value="categorias" className="space-y-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gestão de Categorias</h3>
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger render={
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Categoria
                  </Button>
                } />
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleAddCategory}>
                    <DialogHeader>
                      <DialogTitle>Adicionar Categoria</DialogTitle>
                      <DialogDescription>
                        Cadastre uma nova categoria de produtos ou estoque.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category-name">Nome da Categoria</Label>
                        <Input
                          id="category-name"
                          value={categoryForm.name}
                          onChange={(event) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
                          placeholder="Ex: Bolos"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Tipo</Label>
                        <Select
                          value={categoryForm.type}
                          onValueChange={(value) =>
                            setCategoryForm((prev) => ({
                              ...prev,
                              type: (value ?? "PRODUCT") as "PRODUCT" | "STOCK",
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PRODUCT">Categoria de Produtos</SelectItem>
                            <SelectItem value="STOCK">Categoria de Estoque</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsCategoryDialogOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={!canSubmitCategory}>
                        {createCategoryMutation.isPending ? "Salvando..." : "Salvar Categoria"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Categorias de Produtos</Label>
                <div className="space-y-2 mt-2">
                  {isLoadingProductCategories ? (
                    <div className="text-sm text-muted-foreground">Carregando categorias...</div>
                  ) : (productCategories?.length ?? 0) === 0 ? (
                    <div className="text-sm text-muted-foreground">sem dados cadastrados</div>
                  ) : (
                    productCategories?.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-2 bg-secondary rounded"
                      >
                        <span className="text-sm">{category.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                          disabled={deleteCategoryMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div>
                <Label>Categorias de Estoque</Label>
                <div className="space-y-2 mt-2">
                  {isLoadingStockCategories ? (
                    <div className="text-sm text-muted-foreground">Carregando categorias...</div>
                  ) : (stockCategories?.length ?? 0) === 0 ? (
                    <div className="text-sm text-muted-foreground">sem dados cadastrados</div>
                  ) : (
                    stockCategories?.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-2 bg-secondary rounded"
                      >
                        <span className="text-sm">{category.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCategoryMutation.mutate(category.id)}
                          disabled={deleteCategoryMutation.isPending}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
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
                  <form onSubmit={handleAddProduct}>
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
                          value={productForm.name}
                          onChange={(event) =>
                            setProductForm((prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
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
                          value={productForm.price}
                          onChange={(event) =>
                            setProductForm((prev) => ({
                              ...prev,
                              price: event.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Categoria</Label>
                        <Select
                          value={productForm.categoryId}
                          onValueChange={(value) =>
                            setProductForm((prev) => ({
                              ...prev,
                              categoryId: value ?? "",
                            }))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                isLoadingProductCategories
                                  ? "Carregando categorias..."
                                  : "Selecione uma categoria"
                              }
                            >
                              {(value) => {
                                if (!value) {
                                  return isLoadingProductCategories
                                    ? "Carregando categorias..."
                                    : "Selecione uma categoria"
                                }

                                const matchedCategory = productCategories?.find(
                                  (category) => category.id === value
                                )

                                return matchedCategory?.name ?? String(value)
                              }}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {hasProductCategories ? (
                              productCategories?.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="__empty" disabled>
                                sem dados cadastrados
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={!canSubmitProduct || !hasProductCategories}>
                        {createProductMutation.isPending ? "Salvando..." : "Salvar Produto"}
                      </Button>
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
                {isLoadingProducts ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Carregando produtos...
                    </TableCell>
                  </TableRow>
                ) : productsList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      sem dados cadastrados
                    </TableCell>
                  </TableRow>
                ) : (
                  productsList.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
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
