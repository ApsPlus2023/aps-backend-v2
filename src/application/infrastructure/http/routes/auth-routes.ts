import { FastifyInstance } from 'fastify';
import { authenticateUser } from '../../../use-cases/authenticate-user';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = request.body as { email: string; password: string };
      const { token } = await authenticateUser({ email, password });

      // Envia o token via cookie com opções de segurança para produção
      reply.setCookie("token", token, {
        path: "/",
        httpOnly: true,
        secure: true,        // O cookie só é enviado via HTTPS
        sameSite: "none",    // Permite requisições cross-site
      });

      return reply.send({ token });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(401).send({ error: errorMessage });
    }
  });
}
