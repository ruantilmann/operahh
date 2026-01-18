"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Home,
    Zap,
    Droplets,
    Flame,
    Wifi,
    FileText,
    Plus,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fixedCosts = [
    {
        name: "Aluguel",
        icon: Home,
        value: 2500,
        lastUse: "01/11/2025",
        color: "primary",
    },
    {
        name: "Energia",
        icon: Zap,
        value: 450,
        lastUse: "15/11/2025",
        color: "warning",
    },
    {
        name: "Água",
        icon: Droplets,
        value: 180,
        lastUse: "10/11/2025",
        color: "accent",
    },
    {
        name: "Gás",
        icon: Flame,
        value: 320,
        lastUse: "12/11/2025",
        color: "destructive",
    },
    {
        name: "Internet",
        icon: Wifi,
        value: 120,
        lastUse: "05/11/2025",
        color: "primary",
    },
    {
        name: "Taxas e Licenças",
        icon: FileText,
        value: 280,
        lastUse: "01/11/2025",
        color: "secondary",
    },
];

export default function CustoFixo() {
    const totalFixed = fixedCosts.reduce((sum, cost) => sum + cost.value, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Custo Fixo</h1>
                    <p className="text-muted-foreground">
                        Gerencie seus custos fixos mensais
                    </p>
                </div>
                <Button size="lg" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Custo
                </Button>
            </div>

            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">
                            Total de Custos Fixos Mensais
                        </p>
                        <p className="text-4xl font-bold text-foreground">
                            R$ {totalFixed.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fixedCosts.map((cost, index) => {
                    const Icon = cost.icon;
                    return (
                        <Card
                            key={index}
                            className={cn(
                                "p-6 transition-all hover:shadow-lg cursor-pointer",
                                "border-l-4",
                                `border-l-${cost.color}`
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className={cn(
                                        "h-12 w-12 rounded-lg flex items-center justify-center",
                                        "bg-secondary"
                                    )}
                                >
                                    <Icon className={cn("h-6 w-6", `text-${cost.color}`)} />
                                </div>
                                <Button variant="ghost" size="sm">
                                    Editar
                                </Button>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{cost.name}</h3>
                            <p className="text-2xl font-bold text-foreground mb-3">
                                R$ {cost.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                            <div className="text-sm text-muted-foreground">
                                <p>Último uso: {cost.lastUse}</p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-4">
                                Ver Histórico
                            </Button>
                        </Card>
                    );
                })}
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Evolução dos Custos Fixos</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <span className="font-medium">Média Mensal (6 meses)</span>
                        <span className="font-bold text-foreground">R$ 3.750,00</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <span className="font-medium">Mês Anterior</span>
                        <span className="font-bold text-foreground">R$ 3.820,00</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                        <span className="font-medium">Economia este mês</span>
                        <span className="font-bold text-green-500">- R$ 70,00 (1.8%)</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
