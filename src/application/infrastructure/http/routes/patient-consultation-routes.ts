import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../../infrastructure/database/prisma-client";
import { getPatientConsultationInfo } from "../../../use-cases/patient-consultation-info";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function patientConsultationRoutes(fastify: FastifyInstance) {
  fastify.decorate("authenticate", async function (
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.get(
    "/consultation-info",
    {
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const payload = request.user as { id: string; type?: string } | undefined;
        if (!payload?.id) {
          return reply.status(401).send({ error: "Usuário não autenticado" });
        }

        if (payload.type !== "PATIENT") {
          return reply
            .status(403)
            .send({ error: "Apenas usuários do tipo PATIENT podem ver isto" });
        }

        const info = await getPatientConsultationInfo({ patientId: payload.id });
        return reply.send(info);
      } catch (err) {
        console.error(err);
        return reply
          .status(400)
          .send({ error: "Erro ao buscar consultas do paciente" });
      }
    }
  );
}
