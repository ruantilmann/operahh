import type { RouterClient } from "@orpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../index";
import { userRouter } from "./users";
import { settingsRouter } from "./settings";
import { categoriesRouter } from "./categories";
import { productsRouter } from "./products";

export const appRouter = {
  healthCheck: publicProcedure
    .output(z.string())
    .handler(() => {
      return "OK";
    }),
  privateData: protectedProcedure
    .output(z.object({ message: z.string() }))
    .handler(() => {
      return {
        message: "This is private!!!!",
      };
    }),

  // Módulo de usuários
  user: userRouter,

  // Módulo de configurações
  settings: settingsRouter,

  // Módulo de categorias
  categories: categoriesRouter,

  // Módulo de produtos
  products: productsRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
