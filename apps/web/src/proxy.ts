import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@operahh/auth";

export async function proxy(request: NextRequest) {
  // Identifica a rota atual.
  const pathname = request.nextUrl.pathname;
  const isLoginRoute = pathname.startsWith("/login");
  const protectedRoutes = [
    "/dashboard",
    "/configuracoes",
    "/base-de-dados",
    "/caixa",
    "/inventario",
    "/producao",
    "/precificacao",
    "/lucro",
    "/faturamento",
    "/estoque",
    "/custo-fixo",
    "/checklists",
  ];
  // Verifica rotas protegidas exatas e aninhadas.
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !isLoginRoute) {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      // Usuarios sem autenticacao sao redirecionados para login.
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Continua para a rota solicitada.
  return NextResponse.next();
}

export const config = {
  // Executa para todas as rotas, exceto internas do Next e assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
