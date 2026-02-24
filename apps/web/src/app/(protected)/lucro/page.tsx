"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    TrendingUp,
    Megaphone,
    Shield,
    Rocket,
    Wallet,
    ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProfitBoxColor = "primary" | "accent" | "success" | "warning" | "destructive";

const profitBoxes: Array<{
    name: string;
    icon: typeof TrendingUp;
    percentage: number;
    currentValue: number;
    color: ProfitBoxColor;
    description: string;
}> = [
    {
        name: "Reinvestimento",
        icon: TrendingUp,
        percentage: 30,
        currentValue: 12840,
        color: "primary",
        description: "Melhoria de equipamentos e infraestrutura",
    },
    {
        name: "Marketing",
        icon: Megaphone,
        percentage: 20,
        currentValue: 8560,
        color: "accent",
        description: "Publicidade e crescimento de vendas",
    },
    {
        name: "Caixa de Segurança",
        icon: Shield,
        percentage: 25,
        currentValue: 10700,
        color: "success",
        description: "Reserva para emergências",
    },
    {
        name: "Expansão",
        icon: Rocket,
        percentage: 15,
        currentValue: 6420,
        color: "warning",
        description: "Novos produtos e mercados",
    },
    {
        name: "Salário Empresarial",
        icon: Wallet,
        percentage: 10,
        currentValue: 4280,
        color: "destructive",
        description: "Remuneração do proprietário",
    },
];

const colorClasses: Record<ProfitBoxColor, string> = {
    primary: "border-l-primary text-primary",
    accent: "border-l-accent text-accent",
    success: "border-l-green-500 text-green-500",
    warning: "border-l-yellow-500 text-yellow-500",
    destructive: "border-l-destructive text-destructive",
};

export default function Lucro() {
    const totalLucro = profitBoxes.reduce((sum, box) => sum + box.currentValue, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                    Lucro - Caixinhas da Empresa
                </h1>
                <p className="text-muted-foreground">
                    Distribua e acompanhe a destinação dos lucros
                </p>
            </div>

            <Card className="p-6 bg-gradient-to-br from-green-500/5 to-primary/5 border-green-500/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Lucro Total Acumulado</p>
                        <p className="text-4xl font-bold text-foreground">
                            R$ {totalLucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                            <ArrowUpRight className="h-4 w-4" />
                            +15% vs mês anterior
                        </p>
                    </div>
                    <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
                        <TrendingUp className="h-10 w-10 text-green-500" />
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profitBoxes.map((box, index) => {
                    const Icon = box.icon;
                    const colorClass = colorClasses[box.color] ?? "";
                    return (
                        <Card
                            key={index}
                            className={cn(
                                "p-6 transition-all hover:shadow-lg",
                                "border-l-4",
                                colorClass
                            )}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "h-12 w-12 rounded-lg flex items-center justify-center",
                                            "bg-secondary"
                                        )}
                                    >
                                        <Icon className={cn("h-6 w-6", colorClass)} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{box.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {box.percentage}% do lucro
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-3xl font-bold text-foreground mb-2">
                                R${" "}
                                {box.currentValue.toLocaleString("pt-BR", {
                                    minimumFractionDigits: 2,
                                })}
                            </p>

                            <p className="text-sm text-muted-foreground mb-4">
                                {box.description}
                            </p>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Meta mensal</span>
                                    <span className="font-medium">85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <Button variant="outline" size="sm">
                                    Ver Histórico
                                </Button>
                                <Button variant="ghost" size="sm">
                                    Usar Valor
                                </Button>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Distribuição do Lucro</h3>
                <div className="space-y-4">
                    {profitBoxes.map((box, index) => (
                        <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{box.name}</span>
                                <span className="text-muted-foreground">{box.percentage}%</span>
                            </div>
                            <Progress value={box.percentage} className="h-3" />
                        </div>
                    ))}
                </div>
            </Card>

            <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-primary" />
                    Resumo Financeiro
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-card rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Lucro Este Mês</p>
                        <p className="text-2xl font-bold text-foreground">R$ 8.450,00</p>
                    </div>
                    <div className="p-4 bg-card rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Média Mensal (6m)</p>
                        <p className="text-2xl font-bold text-foreground">R$ 7.140,00</p>
                    </div>
                    <div className="p-4 bg-card rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Projeção Anual</p>
                        <p className="text-2xl font-bold text-green-500">R$ 101.400,00</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}
