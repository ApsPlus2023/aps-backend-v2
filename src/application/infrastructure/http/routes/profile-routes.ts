import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../../infrastructure/database/prisma-client';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function profileRoutes(fastify: FastifyInstance) {
  fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.get("/me", { preHandler: [fastify.authenticate] }, async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { id: string };
    if (!payload?.id) {
      return reply.status(401).send({ error: "Usuário não autenticado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        name: true,
        email: true,
        profilePhoto: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: "Usuário não encontrado" });
    }

    return reply.send(user);
  });
}
