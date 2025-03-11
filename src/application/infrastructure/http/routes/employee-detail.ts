import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../../../infrastructure/database/prisma-client";

export async function employeeDetailRoutes(fastify: FastifyInstance) {
  fastify.get("/employees/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const employee = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        employeeRole: true,
        hireDate: true,
        workDays: true,
        profilePhoto: true,
        status: true,
        address: true,
        createdAt: true,
        type: true,
        coren: true, 
        crm: true, 
      },
    });
    if (!employee || employee.type !== "EMPLOYEE") {
      return reply.status(404).send({ error: "Funcionário não encontrado" });
    }
    return reply.send(employee);
  });
}
