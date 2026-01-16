import type { ReactNode } from "react";

import { AppSidebar } from "@/components/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import UserMenu from "@/components/user-menu";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-4">
            <ModeToggle />
            <UserMenu />
          </div>
        </header>
        <main className="flex flex-1 flex-col p-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}