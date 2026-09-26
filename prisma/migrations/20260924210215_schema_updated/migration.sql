/*
  Warnings:

  - You are about to drop the column `provider` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title,authorId]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "provider",
ALTER COLUMN "reference" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_title_authorId_key" ON "Book"("title", "authorId");
