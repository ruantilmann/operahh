import { ORPCError } from "@orpc/server";
import prisma from "@operahh/db";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../index";

const publicProfileOutput = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().nullable(),
  createdAt: z.string(),
});

const ownProfileOutput = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
  createdAt: z.string(),
});

const updateProfileOutput = z.object({
  success: z.boolean(),
  updatedFields: z.array(z.string()),
  userId: z.string(),
});

export const userRouter = {
  // Endpoint público para obter informações públicas do usuário
  getPublicProfile: publicProcedure
    .input(z.object({
      userId: z.string().min(1),
    }))
    .output(publicProfileOutput)
    .handler(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.userId },
        select: {
          id: true,
          name: true,
          image: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new ORPCError("NOT_FOUND");
      }

      return {
        id: user.id,
        name: user.name,
        image: user.image ?? null,
        createdAt: user.createdAt.toISOString(),
      };
    }),

  // Endpoint protegido para obter informações do próprio usuário
  getOwnProfile: protectedProcedure
    .output(ownProfileOutput)
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
        image: user.image ?? null,
        createdAt: user.createdAt.toISOString(),
      };
    }),

  // Endpoint protegido para atualizar o perfil do usuário
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100).optional(),
      email: z.string().email().optional(),
    }))
    .output(updateProfileOutput)
    .handler(async ({ input, context }) => {
      const user = context.session?.user;
      if (!user) {
        throw new Error("Usuário não encontrado");
      }

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
};
