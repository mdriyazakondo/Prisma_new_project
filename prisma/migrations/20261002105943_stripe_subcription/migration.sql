/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubcriptionId]` on the table `subcriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeSubcriptionId` to the `subcriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subcriptions" ADD COLUMN     "stripeSubcriptionId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "subcriptions_stripeSubcriptionId_key" ON "subcriptions"("stripeSubcriptionId");
