import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getDashboardStats } from "../../../use-cases/get-dashboard-stats";

export async function dashboardStatsRoutes(fastify: FastifyInstance) {
  fastify.get("/dashboard-stats", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await getDashboardStats();
      return reply.send(stats);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(400).send({ error: errorMessage });
    }
  });
}
