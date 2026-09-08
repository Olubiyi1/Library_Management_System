-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('STUDENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "Section" AS ENUM ('TECH_1', 'TECH_2', 'TECH_3');

-- CreateEnum
CREATE TYPE "Department" AS ENUM ('RAC', 'ELECTRICAL', 'PLUMBING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "accountType" "AccountType" NOT NULL DEFAULT 'STUDENT',
    "section" "Section",
    "department" "Department",
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
