import { FastifyInstance } from 'fastify'
import { prisma } from '../../../infrastructure/database/prisma-client'

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', async (request, reply) => {
    try {
      const users = await prisma.user.findMany({
        where: { type: 'PATIENT' },
        select: {
          id: true,
          name: true,
          email: true,
          type: true,
          status: true,
        },
      })

      return reply.send({ users })
    } catch (error) {
      return reply.status(400).send({ error: 'Erro ao buscar usuários' })
    }
  })
}
