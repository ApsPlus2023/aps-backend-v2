import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify"
import { prisma } from "../../../infrastructure/database/prisma-client"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { env } from "../../../config/env"

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function changePasswordRoutes(fastify: FastifyInstance) {
  fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
    try {
      // Certifique-se de que o token seja extraído do cookie configurado
      await request.jwtVerify();
    } catch (err) {
      return reply.status(401).send({ error: "Token inválido ou ausente" });
    }
  });

  fastify.patch(
    "/change-password",
    { preHandler: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const payload = request.user as { id: string } | undefined;
        if (!payload || !payload.id) {
          return reply.status(401).send({ error: "Usuário não autenticado" });
        }
        const userId = payload.id;

        const { currentPassword, newPassword } = request.body as {
          currentPassword: string;
          newPassword: string;
        };

        const userFromDb = await prisma.user.findUnique({ where: { id: userId } });
        if (!userFromDb) {
          return reply.status(404).send({ error: "Usuário não encontrado" });
        }

        if (!userFromDb.password) {
          return reply.status(400).send({ error: "Usuário não possui senha cadastrada" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, userFromDb.password);
        if (!isPasswordValid) {
          return reply.status(400).send({ error: "Senha atual incorreta" });
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
          where: { id: userId },
          data: { password: newHashedPassword },
        });

        return reply.status(204).send();
      } catch (error) {
        console.error("Erro ao alterar senha:", error);
        return reply.status(400).send({ error: "Erro ao alterar senha" });
      }
    }
  );
}
