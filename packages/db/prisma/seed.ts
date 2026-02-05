import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaPg } from "@prisma/adapter-pg";

import { Prisma, PrismaClient } from "../prisma/generated/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", "..", "..", "apps", "server", ".env"),
});

const baseUrl = process.env.BETTER_AUTH_URL?.replace(/\/$/, "");
const adminPassword = process.env.ADMIN_SEED_PASSWORD;
const databaseUrl = process.env.DATABASE_URL;

if (!baseUrl) {
  console.error("BETTER_AUTH_URL nao definido no .env do servidor.");
  process.exit(1);
}

if (!adminPassword) {
  console.error("ADMIN_SEED_PASSWORD nao definido no .env do servidor.");
  process.exit(1);
}

if (!databaseUrl) {
  console.error("DATABASE_URL nao definido no .env do servidor.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

const payload = {
  email: "admin@gmail.com",
  password: adminPassword,
  name: "Admin",
};

const categories = [
  {
    name: "Copos",
    products: [
      { name: "Copo Ninho com Nutella", price: "24.90" },
      { name: "Copo Ninho com Moragos e Nutella", price: "26.90" },
      { name: "Copo Folhata de Morango", price: "22.90" },
    ],
  },
  {
    name: "Cookies",
    products: [
      { name: "Cookie Kinder Bueno", price: "16.90" },
      { name: "Cookie Nutella", price: "13.90" },
      { name: "Cookie Red Velvet", price: "13.90" },
      { name: "Cookie Clássico", price: "11.90" },
    ],
  },
  {
    name: "Quiches",
    products: [
      { name: "Quiche 4 Queijos", price: "16.90" },
      { name: "Quiche Frango Defumado com Cream Cheese", price: "14.90" },
    ],
  },
];

const seedCatalog = async () => {
  for (const category of categories) {
    const categoryRecord = await prisma.category.upsert({
      where: {
        type_name: {
          type: "PRODUCT",
          name: category.name,
        },
      },
      update: {},
      create: {
        name: category.name,
        type: "PRODUCT",
      },
    });

    for (const product of category.products) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          name: product.name,
          categoryId: categoryRecord.id,
        },
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            name: product.name,
            price: new Prisma.Decimal(product.price),
            categoryId: categoryRecord.id,
          },
        });
      }
    }
  }
};

const seedAdmin = async () => {
  const origin = process.env.CORS_ORIGIN || baseUrl;
  const response = await fetch(`${baseUrl}/api/auth/sign-up/email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origin,
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    console.log("Usuario admin criado com sucesso.");
    return;
  }

  if (response.status === 409) {
    console.log("Usuario admin ja existe.");
    return;
  }

  const body = await response.text();
  throw new Error(
    `Falha ao criar usuario admin: status=${response.status} ${response.statusText} ${body || "(sem resposta)"}`
  );
};

try {
  await seedCatalog();
  await seedAdmin();
  process.exit(0);
} catch (error) {
  console.error("Erro ao executar seed:", error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
