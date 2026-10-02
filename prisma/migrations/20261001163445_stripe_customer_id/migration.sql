/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Subcription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stripeCustomerId` to the `Subcription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Subcription" ADD COLUMN     "stripeCustomerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subcription_stripeCustomerId_key" ON "Subcription"("stripeCustomerId");
