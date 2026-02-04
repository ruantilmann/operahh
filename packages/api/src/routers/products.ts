import { ORPCError } from "@orpc/server";
import prisma from "@operahh/db";
import { z } from "zod";

import { protectedProcedure } from "../index";

const categoryTypeEnum = z.enum(["PRODUCT", "STOCK"]);

const categoryOutput = z.object({
  id: z.string(),
  name: z.string(),
  type: categoryTypeEnum,
});

const productOutput = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  categoryId: z.string(),
  category: categoryOutput,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const createInput = z.object({
  name: z.string().trim().min(1).max(120),
  price: z.number().positive(),
  categoryId: z.string().min(1),
});

const updateInput = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(120).optional(),
  price: z.number().positive().optional(),
  categoryId: z.string().min(1).optional(),
});

const deleteInput = z.object({
  id: z.string().min(1),
});

export const productsRouter = {
  list: protectedProcedure
    .output(z.array(productOutput))
    .handler(async () => {
      const products = await prisma.product.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price.toNumber(),
        categoryId: product.categoryId,
        category: {
          id: product.category.id,
          name: product.category.name,
          type: product.category.type,
        },
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      }));
    }),

  create: protectedProcedure
    .input(createInput)
    .output(productOutput)
    .handler(async ({ input }) => {
      const category = await prisma.category.findUnique({
        where: { id: input.categoryId },
        select: { id: true, type: true, name: true },
      });

      if (!category) {
        throw new ORPCError("NOT_FOUND");
      }

      if (category.type !== "PRODUCT") {
        throw new Error("Categoria invalida para produto");
      }

      const product = await prisma.product.create({
        data: {
          name: input.name.trim(),
          price: input.price,
          categoryId: input.categoryId,
        },
        include: {
          category: true,
        },
      });

      return {
        id: product.id,
        name: product.name,
        price: product.price.toNumber(),
        categoryId: product.categoryId,
        category: {
          id: product.category.id,
          name: product.category.name,
          type: product.category.type,
        },
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    }),

  update: protectedProcedure
    .input(updateInput)
    .output(productOutput)
    .handler(async ({ input }) => {
      const data: {
        name?: string;
        price?: number;
        categoryId?: string;
      } = {};

      if (input.name) {
        data.name = input.name.trim();
      }

      if (typeof input.price === "number") {
        data.price = input.price;
      }

      if (input.categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: input.categoryId },
          select: { id: true, type: true },
        });

        if (!category) {
          throw new ORPCError("NOT_FOUND");
        }

        if (category.type !== "PRODUCT") {
          throw new Error("Categoria invalida para produto");
        }

        data.categoryId = input.categoryId;
      }

      if (Object.keys(data).length === 0) {
        throw new Error("Nenhuma alteracao informada");
      }

      const product = await prisma.product.update({
        where: { id: input.id },
        data,
        include: {
          category: true,
        },
      });

      return {
        id: product.id,
        name: product.name,
        price: product.price.toNumber(),
        categoryId: product.categoryId,
        category: {
          id: product.category.id,
          name: product.category.name,
          type: product.category.type,
        },
        createdAt: product.createdAt.toISOString(),
        updatedAt: product.updatedAt.toISOString(),
      };
    }),

  delete: protectedProcedure
    .input(deleteInput)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!product) {
        throw new ORPCError("NOT_FOUND");
      }

      await prisma.product.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
};
