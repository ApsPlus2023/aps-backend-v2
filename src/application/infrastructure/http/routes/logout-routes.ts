import { FastifyInstance } from 'fastify';

export async function logoutRoutes(fastify: FastifyInstance) {
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('token', { path: '/' });
    return reply.send({ message: 'Logout realizado com sucesso' });
  });
}
