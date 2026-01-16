"use client";

import * as React from "react";
import Link from "next/link";

import {
  LayoutDashboard,
  CheckSquare,
  Factory,
  Calculator,
  TrendingUp,
  Wallet,
  Receipt,
  PiggyBank,
  Package,
  Archive,
  Settings,
  User,
  LogOut,
  Database,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Define the navigation items
const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/checklists", label: "Checklists", icon: CheckSquare },
  { to: "/producao", label: "Produção", icon: Factory },
  { to: "/precificacao", label: "Precificação", icon: Calculator },
  { to: "/faturamento", label: "Faturamento", icon: TrendingUp },
  { to: "/caixa", label: "Caixa", icon: Wallet },
  { to: "/custo-fixo", label: "Custo Fixo", icon: Calculator },
  { to: "/lucro", label: "Lucro", icon: TrendingUp },
  { to: "/inventario", label: "Inventário", icon: Package },
  { to: "/estoque", label: "Estoque", icon: Factory },
  { to: "/base-de-dados", label: "Base de Dados", icon: Database },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <div className="px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">O</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">Operah</h1>
              <p className="text-xs text-muted-foreground">Gestão de Negócios Alimentícios</p>
            </div>
          </div>
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <Link href={item.to}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}