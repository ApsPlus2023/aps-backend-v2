import { prisma } from '../infrastructure/database/prisma-client'
import bcrypt from 'bcryptjs'

interface UpdatePasswordInput {
  userId: string
  password: string
}

export async function updatePassword({ userId, password }: UpdatePasswordInput) {
 
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  })

  return updatedUser
}
