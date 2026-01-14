import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

export const userRouter = {
  // Endpoint público para obter informações públicas do usuário
  getPublicProfile: publicProcedure
    .input(z.object({
      userId: z.string().uuid(),
    }))
    .handler(async ({ input }) => {
      // Simulação de busca de perfil público
      return {
        id: input.userId,
        name: "Usuário Exemplo",
        avatar: null,
        createdAt: new Date().toISOString(),
      };
    }),

  // Endpoint protegido para obter informações do próprio usuário
  getOwnProfile: protectedProcedure
    .handler(({ context }) => {
      const user = context.session?.user;
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
      };
    }),

  // Endpoint protegido para atualizar o perfil do usuário
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100).optional(),
      email: z.string().email().optional(),
    }))
    .handler(async ({ input, context }) => {
      const user = context.session?.user;
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      
      // Simulação de atualização de perfil
      return {
        success: true,
        updatedFields: Object.keys(input),
        userId: user.id,
      };
    }),
};