"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from "lucide-react";

export default function BaseDeDadosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Base de Dados</h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe os dados financeiros e receitas
        </p>
      </div>

      <Tabs defaultValue="financeiro" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="receitas">Receitas</TabsTrigger>
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
      </Tabs>
    </div>
  );
}