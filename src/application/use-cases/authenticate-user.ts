import { prisma } from '../infrastructure/database/prisma-client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface AuthenticateUserInput {
  email: string;
  password: string;
}

export async function authenticateUser({ email, password }: AuthenticateUserInput) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (!user.password) {
    throw new Error('Usuário não possui senha definida');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Senha inválida');
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: user.type,
      employeeRole: user.employeeRole,
    },
    env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { token };
}
