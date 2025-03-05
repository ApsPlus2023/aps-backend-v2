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
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
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
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });

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
              recordNumber: true
            }
          }
        },
      });

      if (!patient) {
        return reply.status(404).send({ error: 'Paciente não encontrado' });
      }

      return reply.send({ patient });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      return reply.status(400).send({ error: errorMessage });
    }
  });
}
