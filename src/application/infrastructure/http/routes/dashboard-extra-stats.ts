import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getDashboardExtraStats } from "../../../use-cases/get-dashboard-extra-stats";

export async function dashboardExtraStatsRoutes(fastify: FastifyInstance) {
  fastify.get("/dashboard-extra-stats", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await getDashboardExtraStats();
      return reply.send(stats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: errorMessage });
    }
  });
}
