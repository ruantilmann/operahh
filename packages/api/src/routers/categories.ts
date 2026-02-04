import { ORPCError } from "@orpc/server";
import prisma from "@operahh/db";
import { z } from "zod";

import { protectedProcedure } from "../index";

const categoryTypeEnum = z.enum(["PRODUCT", "STOCK"]);

const categoryOutput = z.object({
  id: z.string(),
  name: z.string(),
  type: categoryTypeEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});

const listInput = z.object({
  type: categoryTypeEnum.optional(),
});

const createInput = z.object({
  name: z.string().trim().min(1).max(80),
  type: categoryTypeEnum,
});

const deleteInput = z.object({
  id: z.string().min(1),
});

export const categoriesRouter = {
  list: protectedProcedure
    .input(listInput)
    .output(z.array(categoryOutput))
    .handler(async ({ input }) => {
      const categories = await prisma.category.findMany({
        where: input.type ? { type: input.type } : undefined,
        orderBy: {
          name: "asc",
        },
      });

      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        type: category.type,
        createdAt: category.createdAt.toISOString(),
        updatedAt: category.updatedAt.toISOString(),
      }));
    }),

  create: protectedProcedure
    .input(createInput)
    .output(categoryOutput)
    .handler(async ({ input }) => {
      try {
        const category = await prisma.category.create({
          data: {
            name: input.name.trim(),
            type: input.type,
          },
        });

        return {
          id: category.id,
          name: category.name,
          type: category.type,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
        };
      } catch (error) {
        if (error instanceof Error && "code" in error && error.code === "P2002") {
          throw new Error("Categoria ja existe");
        }
        throw error;
      }
    }),

  delete: protectedProcedure
    .input(deleteInput)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input }) => {
      const category = await prisma.category.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!category) {
        throw new ORPCError("NOT_FOUND");
      }

      const linkedProducts = await prisma.product.count({
        where: { categoryId: input.id },
      });

      if (linkedProducts > 0) {
        throw new Error("Categoria possui produtos vinculados");
      }

      await prisma.category.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
};
