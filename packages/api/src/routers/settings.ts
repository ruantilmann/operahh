import { z } from "zod";
import { protectedProcedure } from "../index";
import prisma from "@operahh/db";

export const settingsRouter = {
  // Endpoint protegido para obter as informações do usuário
  getUserSettings: protectedProcedure
    .handler(async ({ context }) => {
      const user = context.session?.user;
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      // Retorna todos os campos relevantes do usuário
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
      };
    }),

  // Endpoint protegido para listar todos os usuários do sistema
  getAllUsers: protectedProcedure
    .handler(async () => {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return users;
    }),

   // Endpoint protegido para atualizar as informações do usuário logado
   updateUserSettings: protectedProcedure
     .input(z.object({
       name: z.string().min(1).max(100).optional(),
       email: z.string().email().optional(),
     }))
     .handler(async ({ input, context }) => {
       const user = context.session?.user;
       if (!user) {
         throw new Error("Usuário não encontrado");
       }

       // Atualizar usuário no banco de dados
       await prisma.user.update({
         where: { id: user.id },
         data: input,
       });

       return {
         success: true,
         updatedFields: Object.keys(input),
         userId: user.id,
       };
     }),

   // Endpoint protegido para atualizar qualquer usuário (para admins)
   updateUser: protectedProcedure
     .input(z.object({
       userId: z.string(),
       name: z.string().min(1).max(100).optional(),
       email: z.string().email().optional(),
     }))
     .handler(async ({ input }) => {
       // Atualizar usuário específico no banco de dados
       await prisma.user.update({
         where: { id: input.userId },
         data: {
           name: input.name,
           email: input.email,
         },
       });

       return {
         success: true,
         updatedFields: ["name", "email"],
         userId: input.userId,
       };
     }),
};