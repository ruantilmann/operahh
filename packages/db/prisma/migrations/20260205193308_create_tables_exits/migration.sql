-- CreateEnum
CREATE TYPE "ExitCategory" AS ENUM ('MATERIA', 'ENERGIA', 'AGUA', 'GAS', 'ALUGUEL', 'OUTROS');

-- CreateTable
CREATE TABLE "cash_exits" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "category" "ExitCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL,
    "responsible" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_exits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cash_exits_date_idx" ON "cash_exits"("date");

-- CreateIndex
CREATE INDEX "cash_exits_category_idx" ON "cash_exits"("category");
