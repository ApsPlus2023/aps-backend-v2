import { FastifyInstance } from 'fastify';
import { createPatient } from '../../../use-cases/create-pacient';
import { prisma } from '../../../infrastructure/database/prisma-client';

export async function patientRoutes(fastify: FastifyInstance) {
  // (1) Criar um paciente (POST /patients)
  fastify.post('/patients', async (request, reply) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        cpf,
        rg,
        profession,
        bloodType,
        dateOfBirth,
      } = request.body as {
        name: string;
        email: string;
        phone: string;
        address: string;
        cpf: string;
        rg?: string;
        profession?: string;
        bloodType?: string;
        dateOfBirth?: string;
      };

      const patient = await createPatient({
        name,
        email,
        phone,
        address,
        cpf,
        rg,
        profession,
        bloodType,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      });

      return reply.status(201).send(patient);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });

  // (2) Listar todos os pacientes (GET /getPatients)
  fastify.get('/getPatients', async (request, reply) => {
    try {
      const patients = await prisma.user.findMany({
        where: { type: 'PATIENT' },
        select: {
          id: true,
          name: true,
          phone: true,
          cpf: true,
          dateOfBirth: true,
          bloodType: true,
          rg: true,
          profession: true,
          status: true,
          email: true,
        },
      });

      return reply.send({ patients });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });

  // (3) Buscar paciente por id (GET /patients/:id)
  fastify.get('/patients/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const patient = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          phone: true,
          cpf: true,
          dateOfBirth: true,
          bloodType: true,
          rg: true,
          profession: true,
          status: true,
          address: true,
          email: true,
          MedicalRecord: {
            select: {
              recordNumber: true,
            },
          },
        },
      });

      if (!patient) {
        return reply.status(404).send({ error: 'Paciente não encontrado' });
      }

      return reply.send({ patient });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });

  // (4) Ativar paciente (PATCH /patients/:id/activate)
  fastify.patch('/patients/:id/activate', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const updatedPatient = await prisma.user.update({
        where: { id },
        data: { status: 'ATIVO' },
        select: {
          id: true,
          name: true,
          status: true,
        },
      });
      return reply.send({ patient: updatedPatient });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });

  // (5) Inativar paciente (PATCH /patients/:id/deactivate)
  fastify.patch('/patients/:id/deactivate', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const updatedPatient = await prisma.user.update({
        where: { id },
        data: { status: 'INATIVO' },
        select: {
          id: true,
          name: true,
          status: true,
        },
      });
      return reply.send({ patient: updatedPatient });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });

  // (6) Excluir paciente (DELETE /patients/:id)
  fastify.delete('/patients/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      // Verifica se o paciente existe
      const patient = await prisma.user.findUnique({ where: { id } });
      if (!patient) {
        return reply.status(404).send({ error: 'Paciente não encontrado' });
      }

      // Exclui fisicamente o paciente do banco de dados
      await prisma.user.delete({ where: { id } });
      return reply.status(204).send();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });
}
