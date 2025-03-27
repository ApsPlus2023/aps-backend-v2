import { prisma } from "../infrastructure/database/prisma-client";

interface GetUserProfileInput {
  userId: string;
}

export async function getUserProfile({ userId }: GetUserProfileInput) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      profilePhoto: true,
      phone: true,
      cep: true,
      rua: true,
      bairro: true,
      numero: true,
      complemento: true,
      type: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      cpf: true,
      rg: true,
      profession: true,
      bloodType: true,
      dateOfBirth: true,
      employeeRole: true,
      hireDate: true,
      workDays: true,
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  return user;
}
