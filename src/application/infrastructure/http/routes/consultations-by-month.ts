import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getConsultationsByMonth } from "../../../use-cases/get-consultations-by-month";

export async function consultationsByMonthRoutes(fastify: FastifyInstance) {
  fastify.get("/consultations-by-month", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await getConsultationsByMonth();
      return reply.send(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: errorMessage });
    }
  });
}
