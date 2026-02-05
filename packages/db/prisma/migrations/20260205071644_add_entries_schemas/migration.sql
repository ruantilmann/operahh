-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('DINHEIRO', 'CARTAO', 'DEBITO', 'PIX', 'BOLETO');

-- CreateEnum
CREATE TYPE "EntryStatus" AS ENUM ('PENDENTE', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "FulfillmentType" AS ENUM ('ENTREGA', 'RETIRADA');

-- CreateTable
CREATE TABLE "instadelivery_entries" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "fulfillmentType" "FulfillmentType" NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "status" "EntryStatus" NOT NULL DEFAULT 'PAGO',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instadelivery_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instadelivery_entry_items" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productNameSnapshot" TEXT NOT NULL,
    "unitPriceSnapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "instadelivery_entry_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ifood_entries" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "fulfillmentType" "FulfillmentType" NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "status" "EntryStatus" NOT NULL DEFAULT 'PAGO',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ifood_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ifood_entry_items" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productNameSnapshot" TEXT NOT NULL,
    "unitPriceSnapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ifood_entry_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_entries" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "fulfillmentType" "FulfillmentType" NOT NULL,
    "deliveryFee" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "status" "EntryStatus" NOT NULL DEFAULT 'PAGO',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "manual_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manual_entry_items" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productNameSnapshot" TEXT NOT NULL,
    "unitPriceSnapshot" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "manual_entry_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "instadelivery_entries_date_idx" ON "instadelivery_entries"("date");

-- CreateIndex
CREATE INDEX "instadelivery_entry_items_entryId_idx" ON "instadelivery_entry_items"("entryId");

-- CreateIndex
CREATE INDEX "instadelivery_entry_items_productId_idx" ON "instadelivery_entry_items"("productId");

-- CreateIndex
CREATE INDEX "ifood_entries_date_idx" ON "ifood_entries"("date");

-- CreateIndex
CREATE INDEX "ifood_entry_items_entryId_idx" ON "ifood_entry_items"("entryId");

-- CreateIndex
CREATE INDEX "ifood_entry_items_productId_idx" ON "ifood_entry_items"("productId");

-- CreateIndex
CREATE INDEX "manual_entries_date_idx" ON "manual_entries"("date");

-- CreateIndex
CREATE INDEX "manual_entry_items_entryId_idx" ON "manual_entry_items"("entryId");

-- CreateIndex
CREATE INDEX "manual_entry_items_productId_idx" ON "manual_entry_items"("productId");

-- AddForeignKey
ALTER TABLE "instadelivery_entry_items" ADD CONSTRAINT "instadelivery_entry_items_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "instadelivery_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instadelivery_entry_items" ADD CONSTRAINT "instadelivery_entry_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ifood_entry_items" ADD CONSTRAINT "ifood_entry_items_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "ifood_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ifood_entry_items" ADD CONSTRAINT "ifood_entry_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_entry_items" ADD CONSTRAINT "manual_entry_items_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "manual_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manual_entry_items" ADD CONSTRAINT "manual_entry_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
