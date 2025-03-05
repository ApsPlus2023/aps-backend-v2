-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('EMPLOYEE', 'PATIENT');

-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('ENFERMEIRO', 'MEDICO', 'ADMINISTRADOR', 'ATENDENTE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "type" "UserType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT,
    "rg" TEXT,
    "profession" TEXT,
    "bloodType" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "employeeRole" "EmployeeRole",
    "hireDate" TIMESTAMP(3),
    "workDays" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
