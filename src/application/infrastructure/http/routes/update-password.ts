import { FastifyInstance } from 'fastify'
import { updatePassword } from '../../../use-cases/update-password'

export async function updatePasswordRoutes(fastify: FastifyInstance) {
  fastify.post('/update-password', async (request, reply) => {
    try {
      const { userId, password } = request.body as { userId: string; password: string }
      const updatedUser = await updatePassword({ userId, password })
      return reply.send({
        message: "Senha atualizada com sucesso",
        updatedUser
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      return reply.status(400).send({ error: errorMessage })
    }
  })
}


