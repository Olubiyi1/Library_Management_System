/*
  Warnings:

  - You are about to drop the column `availability` on the `Book` table. All the data in the column will be lost.
  - Added the required column `availableCopies` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCopies` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BorrowingStatus" AS ENUM ('BORROWED', 'RETURN_PENDING', 'RETURNED');

-- AlterTable
ALTER TABLE "Book" DROP COLUMN "availability",
ADD COLUMN     "availableCopies" INTEGER NOT NULL,
ADD COLUMN     "totalCopies" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Borrowing" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "borrowedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "BorrowingStatus" NOT NULL DEFAULT 'BORROWED',
    "returnedAt" TIMESTAMP(3),

    CONSTRAINT "Borrowing_pkey" PRIMARY KEY ("id")
);
