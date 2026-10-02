/*
  Warnings:

  - You are about to drop the `Subcription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subcription" DROP CONSTRAINT "Subcription_userId_fkey";

-- DropTable
DROP TABLE "Subcription";

-- CreateTable
CREATE TABLE "subcriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "status" "SubcriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "stripeCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subcriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subcriptions_userId_key" ON "subcriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subcriptions_stripeCustomerId_key" ON "subcriptions"("stripeCustomerId");

-- AddForeignKey
ALTER TABLE "subcriptions" ADD CONSTRAINT "subcriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
