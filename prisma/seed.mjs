import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Pietro@278", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "TESTE",
      email: "pietro@gmail.com",
      phone: "11980141941",
      cep: "01001000",
      rua: "Praça da Sé",
      bairro: "Sé",
      numero: "100",
      complemento: "Apto 101",
      password: passwordHash,
      type: "EMPLOYEE",
      cpf: "52824862880",
      employeeRole: "ADMINISTRADOR",
      status: "ATIVO"
    },
  });

  console.log("Usuário administrador criado:", adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
