import { FastifyInstance } from 'fastify';
import { createEmployee } from '../../../use-cases/create-employee';
import { prisma } from '../../../infrastructure/database/prisma-client';

export async function employeeRoutes(fastify: FastifyInstance) {
  
  fastify.post('/employees', async (request, reply) => {
    try {
      const {
        name,
        email,
        phone,
        employeeRole,
        hireDate,
        workDays,
        profilePhoto,
        address,
      } = request.body as {
        name: string;
        email: string;
        phone: string;
        employeeRole: string;
        hireDate: string; 
        workDays: string;
        profilePhoto?: string;
        address: string;
      };

      const employee = await createEmployee({
        name,
        email,
        phone,
        employeeRole,
        hireDate: new Date(hireDate),
        workDays,
        profilePhoto,
        address,
      });

      return reply.status(201).send(employee);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });

  fastify.get('/employees', async (request, reply) => {
    try {
      const employees = await prisma.user.findMany({
        where: { type: 'EMPLOYEE' },
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
        },
      });
      return reply.send({ employees });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });

  fastify.delete('/employees/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const employee = await prisma.user.findUnique({ where: { id } });
      if (!employee || employee.type !== 'EMPLOYEE') {
        return reply.status(404).send({ error: 'Funcionário não encontrado' });
      }
      await prisma.user.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });
}
