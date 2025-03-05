import { FastifyInstance } from 'fastify'
import { prisma } from '../infrastructure/database/prisma-client'

export async function getPatientsRoutes(fastify: FastifyInstance) {
  fastify.get('/getPatients', async (request, reply) => {
    try {
      const patients = await prisma.user.findMany({
        where: { type: 'PATIENT' },
        select: {
          id: true,
          name: true,
          phone: true,
          cpf: true,
          dateOfBirth: true,
          status: true,
          bloodType: true,
        },
      })

      return reply.send({ patients })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      return reply.status(400).send({ error: errorMessage })
    }
  })
}
