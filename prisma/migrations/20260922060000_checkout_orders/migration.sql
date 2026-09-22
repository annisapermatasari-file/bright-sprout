-- CreateEnum
CREATE TYPE "CheckoutOrderStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'EXPIRED');

-- CreateTable
CREATE TABLE "checkout_orders" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "status" "CheckoutOrderStatus" NOT NULL DEFAULT 'PENDING',
    "dokuTokenId" TEXT,
    "dokuPaymentUrl" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "checkout_orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checkout_orders_invoiceNumber_key" ON "checkout_orders"("invoiceNumber");
