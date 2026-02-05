import { ORPCError } from "@orpc/server";
import prisma from "@operahh/db";
import { z } from "zod";

import { protectedProcedure } from "../index";

const paymentMethodInput = z.enum(["dinheiro", "cartao", "debito", "pix", "boleto"]);
const statusInput = z.enum(["pendente", "pago", "cancelado"]);
const fulfillmentInput = z.enum(["entrega", "retirada"]);

const entryItemInput = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const createInput = z.object({
  date: z.coerce.date(),
  customerName: z.string().trim().min(1).max(120),
  whatsapp: z.string().trim().min(1).max(30),
  fulfillmentType: fulfillmentInput,
  deliveryFee: z.number().min(0),
  paymentMethod: paymentMethodInput,
  amountPaid: z.number().min(0),
  status: statusInput.default("pago"),
  notes: z.string().trim().max(500).optional(),
  items: z.array(entryItemInput).min(1),
});

const entryItemOutput = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  productNameSnapshot: z.string(),
  unitPriceSnapshot: z.number(),
});

const entryOutput = z.object({
  id: z.string(),
  date: z.string(),
  customerName: z.string(),
  whatsapp: z.string(),
  fulfillmentType: fulfillmentInput,
  deliveryFee: z.number(),
  paymentMethod: paymentMethodInput,
  amountPaid: z.number(),
  status: statusInput,
  notes: z.string().nullable(),
  items: z.array(entryItemOutput),
  createdAt: z.string(),
  updatedAt: z.string(),
});

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

const statusMap = {
  pendente: "PENDENTE",
  pago: "PAGO",
  cancelado: "CANCELADO",
} as const;

const statusFromDb = {
  PENDENTE: "pendente",
  PAGO: "pago",
  CANCELADO: "cancelado",
} as const;

const fulfillmentMap = {
  entrega: "ENTREGA",
  retirada: "RETIRADA",
} as const;

const fulfillmentFromDb = {
  ENTREGA: "entrega",
  RETIRADA: "retirada",
} as const;

export const manualEntriesRouter = {
  list: protectedProcedure
    .output(z.array(entryOutput))
    .handler(async () => {
      const entries = await prisma.manualEntry.findMany({
        include: { items: true },
        orderBy: { date: "desc" },
      });

      return entries.map((entry: any) => ({
        id: entry.id,
        date: entry.date.toISOString(),
        customerName: entry.customerName,
        whatsapp: entry.whatsapp,
        fulfillmentType:
          fulfillmentFromDb[entry.fulfillmentType as keyof typeof fulfillmentFromDb],
        deliveryFee: entry.deliveryFee.toNumber(),
        paymentMethod:
          paymentMethodFromDb[entry.paymentMethod as keyof typeof paymentMethodFromDb],
        amountPaid: entry.amountPaid.toNumber(),
        status: statusFromDb[entry.status as keyof typeof statusFromDb],
        notes: entry.notes,
        items: entry.items.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          productNameSnapshot: item.productNameSnapshot,
          unitPriceSnapshot: item.unitPriceSnapshot.toNumber(),
        })),
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      }));
    }),

  create: protectedProcedure
    .input(createInput)
    .output(entryOutput)
    .handler(async ({ input }) => {
      const uniqueProductIds = Array.from(new Set(input.items.map((item) => item.productId)));
      const products = await prisma.product.findMany({
        where: { id: { in: uniqueProductIds } },
      });

      if (products.length !== uniqueProductIds.length) {
        throw new ORPCError("NOT_FOUND");
      }

      const productMap = new Map(products.map((product) => [product.id, product]));

      const entry = await prisma.manualEntry.create({
        data: {
          date: input.date,
          customerName: input.customerName.trim(),
          whatsapp: input.whatsapp.trim(),
          fulfillmentType: fulfillmentMap[input.fulfillmentType],
          deliveryFee: input.deliveryFee,
          paymentMethod: paymentMethodMap[input.paymentMethod],
          amountPaid: input.amountPaid,
          status: statusMap[input.status ?? "pago"],
          notes: input.notes?.trim() || null,
          items: {
            create: input.items.map((item) => {
              const product = productMap.get(item.productId);
              if (!product) {
                throw new ORPCError("NOT_FOUND");
              }

              return {
                productId: item.productId,
                quantity: item.quantity,
                productNameSnapshot: product.name,
                unitPriceSnapshot: product.price,
              };
            }),
          },
        },
        include: { items: true },
      });

      return {
        id: entry.id,
        date: entry.date.toISOString(),
        customerName: entry.customerName,
        whatsapp: entry.whatsapp,
        fulfillmentType:
          fulfillmentFromDb[entry.fulfillmentType as keyof typeof fulfillmentFromDb],
        deliveryFee: entry.deliveryFee.toNumber(),
        paymentMethod:
          paymentMethodFromDb[entry.paymentMethod as keyof typeof paymentMethodFromDb],
        amountPaid: entry.amountPaid.toNumber(),
        status: statusFromDb[entry.status as keyof typeof statusFromDb],
        notes: entry.notes,
        items: entry.items.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          productNameSnapshot: item.productNameSnapshot,
          unitPriceSnapshot: item.unitPriceSnapshot.toNumber(),
        })),
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
      };
    }),
};
