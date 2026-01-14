import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { userRouter } from "./users";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(() => {
    return {
      message: "This is private!!!!",
    };
  }),

  // Módulo de usuários
  user: userRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
