import type { RouterClient } from "@orpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../index";
import { userRouter } from "./users";
import { settingsRouter } from "./settings";
import { categoriesRouter } from "./categories";
import { productsRouter } from "./products";
import { instadeliveryEntriesRouter } from "./instadelivery-entries";
import { ifoodEntriesRouter } from "./ifood-entries";
import { manualEntriesRouter } from "./manual-entries";
import { exitsRouter } from "./exits";

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

  // Módulo de entradas (InstaDelivery, Ifood, Manual)
  instadeliveryEntries: instadeliveryEntriesRouter,
  ifoodEntries: ifoodEntriesRouter,
  manualEntries: manualEntriesRouter,

  // Módulo de saídas
  exits: exitsRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
