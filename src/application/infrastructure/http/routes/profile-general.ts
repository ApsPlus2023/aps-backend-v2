import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getUserProfile } from "../../../use-cases/get-user-profile";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function profileGeneralRoutes(fastify: FastifyInstance) {
  fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.get(
    "/profile",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const payload = request.user as { id: string };
      if (!payload?.id) {
        return reply.status(401).send({ error: "Usuário não autenticado" });
      }
      try {
        const userProfile = await getUserProfile({ userId: payload.id });
        return reply.send(userProfile);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
        return reply.status(404).send({ error: errorMessage });
      }
    }
  );
}
