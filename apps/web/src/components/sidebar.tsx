"use client";

import * as React from "react";
import Link from "next/link";

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
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/checklists", label: "Checklists", icon: "✅" },
  { to: "/producao", label: "Produção", icon: "🛠️" },
  { to: "/precificacao", label: "Precificação", icon: "💰" },
  { to: "/faturamento", label: "Faturamento", icon: "📈" },
  { to: "/caixa", label: "Caixa", icon: "💰" },
  { to: "/custo-fixo", label: "Custo Fixo", icon: "💰" },
  { to: "/lucro", label: "Lucro", icon: "💰" },
  { to: "/inventario", label: "Inventário", icon: "💰" },
  { to: "/estoque", label: "Estoque", icon: "💰" },
  { to: "/configuracoes", label: "Configurações", icon: "💰" },
] as const;

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild>
                    <Link href={item.to}>
                      <span>{item.icon}</span>
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