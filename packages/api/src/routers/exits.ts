import { ORPCError } from "@orpc/server";
import prisma from "@operahh/db";
import { z } from "zod";

import { protectedProcedure } from "../index";

const paymentMethodInput = z.enum(["dinheiro", "cartao", "debito", "pix", "boleto"]);
const categoryInput = z.enum(["materia", "energia", "agua", "gas", "aluguel", "outros"]);

const createInput = z.object({
  date: z.coerce.date(),
  category: categoryInput,
  description: z.string().trim().min(1).max(160),
  amount: z.number().positive(),
  paymentMethod: paymentMethodInput,
  responsible: z.string().trim().min(1).max(120),
});

const updateInput = createInput.extend({
  id: z.string().min(1),
});

const deleteInput = z.object({
  id: z.string().min(1),
});

const exitOutput = z.object({
  id: z.string(),
  date: z.string(),
  category: categoryInput,
  description: z.string(),
  amount: z.number(),
  paymentMethod: paymentMethodInput,
  responsible: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

const categoryMap = {
  materia: "MATERIA",
  energia: "ENERGIA",
  agua: "AGUA",
  gas: "GAS",
  aluguel: "ALUGUEL",
  outros: "OUTROS",
} as const;

const categoryFromDb = {
  MATERIA: "materia",
  ENERGIA: "energia",
  AGUA: "agua",
  GAS: "gas",
  ALUGUEL: "aluguel",
  OUTROS: "outros",
} as const;

const paymentMethodMap = {
  dinheiro: "DINHEIRO",
  cartao: "CARTAO",
  debito: "DEBITO",
  pix: "PIX",
  boleto: "BOLETO",
} as const;

const paymentMethodFromDb = {
  DINHEIRO: "dinheiro",
  CARTAO: "cartao",
  DEBITO: "debito",
  PIX: "pix",
  BOLETO: "boleto",
} as const;

export const exitsRouter = {
  list: protectedProcedure
    .output(z.array(exitOutput))
    .handler(async () => {
      const exits = await prisma.cashExit.findMany({
        orderBy: { date: "desc" },
      });

      return exits.map((exit: any) => ({
        id: exit.id,
        date: exit.date.toISOString(),
        category: categoryFromDb[exit.category as keyof typeof categoryFromDb],
        description: exit.description,
        amount: exit.amount.toNumber(),
        paymentMethod:
          paymentMethodFromDb[exit.paymentMethod as keyof typeof paymentMethodFromDb],
        responsible: exit.responsible,
        createdAt: exit.createdAt.toISOString(),
        updatedAt: exit.updatedAt.toISOString(),
      }));
    }),

  create: protectedProcedure
    .input(createInput)
    .output(exitOutput)
    .handler(async ({ input }) => {
      const exit = await prisma.cashExit.create({
        data: {
          date: input.date,
          category: categoryMap[input.category],
          description: input.description.trim(),
          amount: input.amount,
          paymentMethod: paymentMethodMap[input.paymentMethod],
          responsible: input.responsible.trim(),
        },
      });

      if (!exit) {
        throw new ORPCError("INTERNAL_SERVER_ERROR");
      }

      return {
        id: exit.id,
        date: exit.date.toISOString(),
        category: categoryFromDb[exit.category as keyof typeof categoryFromDb],
        description: exit.description,
        amount: exit.amount.toNumber(),
        paymentMethod:
          paymentMethodFromDb[exit.paymentMethod as keyof typeof paymentMethodFromDb],
        responsible: exit.responsible,
        createdAt: exit.createdAt.toISOString(),
        updatedAt: exit.updatedAt.toISOString(),
      };
    }),

  update: protectedProcedure
    .input(updateInput)
    .output(exitOutput)
    .handler(async ({ input }) => {
      const exitExists = await prisma.cashExit.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!exitExists) {
        throw new ORPCError("NOT_FOUND");
      }

      const exit = await prisma.cashExit.update({
        where: { id: input.id },
        data: {
          date: input.date,
          category: categoryMap[input.category],
          description: input.description.trim(),
          amount: input.amount,
          paymentMethod: paymentMethodMap[input.paymentMethod],
          responsible: input.responsible.trim(),
        },
      });

      return {
        id: exit.id,
        date: exit.date.toISOString(),
        category: categoryFromDb[exit.category as keyof typeof categoryFromDb],
        description: exit.description,
        amount: exit.amount.toNumber(),
        paymentMethod:
          paymentMethodFromDb[exit.paymentMethod as keyof typeof paymentMethodFromDb],
        responsible: exit.responsible,
        createdAt: exit.createdAt.toISOString(),
        updatedAt: exit.updatedAt.toISOString(),
      };
    }),

  delete: protectedProcedure
    .input(deleteInput)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input }) => {
      const exitExists = await prisma.cashExit.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!exitExists) {
        throw new ORPCError("NOT_FOUND");
      }

      await prisma.cashExit.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
};
