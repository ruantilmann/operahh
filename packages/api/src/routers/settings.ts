import { ORPCError } from "@orpc/server";
import { z } from "zod";
import prisma from "@operahh/db";
import { env } from "@operahh/env/server";

import { protectedProcedure } from "../index";

const userSettingsOutput = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string(),
});

const userListOutput = z.array(z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  createdAt: z.string(),
}));

const updateResponseOutput = z.object({
  success: z.boolean(),
  updatedFields: z.array(z.string()),
  userId: z.string(),
});

const createUserOutput = z.object({
  success: z.boolean(),
  user: z.unknown().nullable(),
});

export const settingsRouter = {
  // Endpoint protegido para obter as informações do usuário
  getUserSettings: protectedProcedure
    .output(userSettingsOutput)
    .handler(async ({ context }) => {
      const user = context.session?.user;
      if (!user) {
        throw new ORPCError("UNAUTHORIZED");
      }

      // Retorna todos os campos relevantes do usuário
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image ?? null,
        createdAt: user.createdAt.toISOString(),
      };
    }),

  // Endpoint protegido para listar todos os usuários do sistema
  getAllUsers: protectedProcedure
    .output(userListOutput)
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

      return users.map((user: (typeof users)[number]) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
      }));
    }),

   // Endpoint protegido para atualizar as informações do usuário logado
    updateUserSettings: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(100).optional(),
        email: z.string().email().optional(),
      }))
      .output(updateResponseOutput)
      .handler(async ({ input, context }) => {
       const user = context.session?.user;
       if (!user) {
         throw new ORPCError("UNAUTHORIZED");
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

   // Endpoint protegido para atualizar qualquer usuário
   updateUser: protectedProcedure
       .input(z.object({
         userId: z.string(),
         name: z.string().min(1).max(100).optional(),
         email: z.string().email().optional(),
       }))
       .output(updateResponseOutput)
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

   // Endpoint protegido para criar novo usuário via Better Auth
   createUser: protectedProcedure
     .input(z.object({
       name: z.string().min(2).max(100),
       email: z.string().email(),
       password: z.string().min(8),
     }))
     .output(createUserOutput)
     .handler(async ({ input }) => {
       const baseUrl = env.BETTER_AUTH_URL.replace(/\/$/, "");
       const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Origin: env.CORS_ORIGIN,
         },
         body: JSON.stringify({
           name: input.name,
           email: input.email,
           password: input.password,
         }),
       });

       if (response.ok) {
         const data = (await response.json().catch(() => null)) as { user?: unknown } | null;
         return {
           success: true,
           user: data?.user ?? null,
         };
       }

      if (response.status === 409) {
          throw new ORPCError("CONFLICT");
      }

      await response.text();
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }),
};
